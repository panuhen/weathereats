// tests/weathereats.e2e.spec.ts
import { test, expect } from '@playwright/test';

const MODELS = ['claude-code', 'codex', 'gemini', 'github-gpt'] as const;

async function clickFirstVisible(locators: import('@playwright/test').Locator[]) {
  for (const l of locators) {
    try {
      const el = l.first();
      if (await el.isVisible()) {
        await el.click({ delay: 10 });
        return true;
      }
    } catch {}
  }
  return false;
}

test.describe('WeatherEats – settings & security', () => {
  for (const model of MODELS) {
    test(`${model}: settings opens, value persists, no client OWM/Overpass`, async ({ page, baseURL }) => {
      const url = `${baseURL}/${model}`;
      const forbidden: string[] = [];
      page.on('request', (req) => {
        const u = req.url();
        if (u.includes('api.openweathermap.org') || u.includes('overpass-api.de')) {
          forbidden.push(u);
        }
      });

      await page.goto(url, { waitUntil: 'domcontentloaded' });

      // --- Try to open "Settings" with many strategies
      const openTried = await clickFirstVisible([
        page.getByRole('button', { name: /settings|preferences|options|gear/i }),
        page.getByTestId('open-settings'),
        page.locator('[aria-label*="settings" i]'),
        page.locator('[title*="settings" i]'),
        page.locator('button:has(svg[aria-label*="settings" i])'),
        page.locator('button:has([data-icon*="gear"])'),
        page.locator('button:has-text("Settings")'),
        page.locator('button:has-text("Preferences")'),
        page.locator('header button').first() // last resort
      ]);
      await page.waitForTimeout(400); // let animations run

      // --- Consider any of these as a "settings container"
      const dialog = page.getByRole('dialog');
      const alertDialog = page.getByRole('alertdialog');
      const dataDialog = page.locator('[data-testid="settings-dialog"]');
      const radixPortalDialog = page.locator('[data-radix-portal] [role="dialog"]');
      const sheetLike = page.locator('[data-state="open"][role], [data-state="open"].fixed, [data-state="open"].inset-0');
      const headingSettings = page.getByRole('heading', { name: /settings|preferences/i });

      const settingsContainer =
        (await dialog.isVisible().catch(() => false)) ? dialog :
        (await alertDialog.isVisible().catch(() => false)) ? alertDialog :
        (await dataDialog.isVisible().catch(() => false)) ? dataDialog :
        (await radixPortalDialog.isVisible().catch(() => false)) ? radixPortalDialog :
        (await headingSettings.isVisible().catch(() => false)) ? headingSettings.locator('..') :
        (await sheetLike.first().isVisible().catch(() => false)) ? sheetLike.first() :
        null;

      // Soft-assert open; if not open, we still try inline controls on page
      expect.soft(settingsContainer, `Settings/Preferences UI should appear for ${model}`).not.toBeNull();
      if (!settingsContainer) {
        await page.screenshot({ path: `artifacts/${model}-no-settings.png`, fullPage: true }).catch(() => {});
      }

      // --- Find a control either in the settings container OR anywhere on the page
      const scope = settingsContainer ?? page;
      const sliderByRole = scope.getByRole('slider');
      const ariaSlider = scope.locator('[role="slider"]');
      const rangeInput = scope.locator('input[type="range"]');
      const numberInput = scope.locator('input[type="number"]');
      const testIdInputs = scope.getByTestId(/pref-|threshold|rain|wind|temp|temperature|cold|warm/i);
      const byLabelCold = scope.getByLabel(/cold|low temp/i).locator('input, [role="slider"]');
      const byLabelWarm = scope.getByLabel(/warm|high temp/i).locator('input, [role="slider"]');
      const byLabelRain = scope.getByLabel(/rain|precip/i).locator('input, [role="slider"]');
      const byLabelWind = scope.getByLabel(/wind/i).locator('input, [role="slider"]');

      const candidates = [
        sliderByRole.first(),
        ariaSlider.first(),
        rangeInput.first(),
        numberInput.first(),
        testIdInputs.first(),
        byLabelCold.first(),
        byLabelWarm.first(),
        byLabelRain.first(),
        byLabelWind.first()
      ];

      let control: import('@playwright/test').Locator | null = null;
      for (const c of candidates) {
        try {
          if (await c.isVisible()) { control = c; break; }
        } catch {}
      }

      expect.soft(!!control, `No adjustable control (slider/range/number) found for ${model}`).toBeTruthy();
      if (!control) {
        await page.screenshot({ path: `artifacts/${model}-no-control.png`, fullPage: true }).catch(() => {});
      } else {
        // --- Read before value
        const before =
          (await control.getAttribute('aria-valuenow')) ??
          (await control.getAttribute('value')) ?? '';

        // --- Change value
        const tagName = await control.evaluate(el => el.tagName.toLowerCase());
        let changedVisibly = false;
        if (tagName === 'input') {
          const type = await control.getAttribute('type');
          if (type === 'number') {
            await control.fill('');
            await control.type('7');
            changedVisibly = true;
          } else {
            await control.evaluate((el: HTMLInputElement) => {
              const max = Number(el.max || '100');
              const curr = Number(el.value || '0');
              el.value = String(Math.min(curr + 1, max));
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            });
            changedVisibly = true;
          }
        } else {
          await control.focus().catch(() => {});
          await page.keyboard.press('ArrowRight').catch(() => {});
          await page.keyboard.press('ArrowRight').catch(() => {});
          changedVisibly = true;
        }

        // --- Save/close if buttons exist
        await clickFirstVisible([
          (settingsContainer ?? page).getByRole('button', { name: /save|apply|done|close|ok/i }),
          page.getByTestId('save-settings')
        ]);
        // Escape fallback
        if (settingsContainer && await (settingsContainer).isVisible().catch(() => false)) {
          await page.keyboard.press('Escape').catch(() => {});
        }

        // --- Reload & re-open (if possible) to verify persistence
        await page.reload({ waitUntil: 'domcontentloaded' });
        if (openTried) {
          await clickFirstVisible([
            page.getByRole('button', { name: /settings|preferences|options|gear/i }),
            page.getByTestId('open-settings'),
            page.locator('[aria-label*="settings" i]'),
            page.locator('[title*="settings" i]'),
            page.locator('button:has-text("Settings")'),
            page.locator('button:has-text("Preferences")')
          ]);
        }

        // Re-locate a control after reload (same search)
        const scope2 = (await page.getByRole('dialog').isVisible().catch(() => false))
          ? page.getByRole('dialog')
          : page;
        const afterCtrl =
          (await scope2.getByRole('slider').count()) ? scope2.getByRole('slider').first() :
          (await scope2.locator('[role="slider"]').count()) ? scope2.locator('[role="slider"]').first() :
          (await scope2.locator('input[type="range"]').count()) ? scope2.locator('input[type="range"]').first() :
          (await scope2.locator('input[type="number"]').count()) ? scope2.locator('input[type="number"]').first() :
          null;

        const after =
          afterCtrl
            ? (await afterCtrl.getAttribute('aria-valuenow')) ?? (await afterCtrl.getAttribute('value')) ?? ''
            : '';

        // Fallback: compare relevant localStorage keys if visual didn't change
        let persisted = before !== after;
        if (!persisted) {
          const beforeKeys = await page.evaluate(() => {
            const out: Record<string, string> = {};
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i)!;
              if (/pref|weather|threshold|wind|rain|temp/i.test(k)) out[k] = localStorage.getItem(k)!;
            }
            return out;
          });
          // poke again and save
          await clickFirstVisible([
            page.getByRole('button', { name: /save|apply|done|close|ok/i }),
            page.getByTestId('save-settings')
          ]);
          await page.reload({ waitUntil: 'domcontentloaded' });
          const afterKeys = await page.evaluate(() => {
            const out: Record<string, string> = {};
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i)!;
              if (/pref|weather|threshold|wind|rain|temp/i.test(k)) out[k] = localStorage.getItem(k)!;
            }
            return out;
          });
          persisted = JSON.stringify(beforeKeys) !== JSON.stringify(afterKeys);
        }

        expect.soft(persisted, `Preference did not appear to persist for ${model}`).toBeTruthy();
      }

      // --- Security: no client requests to external services
      expect.soft(forbidden, `Client made forbidden requests: ${forbidden.join(', ')}`).toHaveLength(0);
    });
  }
});
