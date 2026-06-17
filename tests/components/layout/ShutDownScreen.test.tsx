import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, vi } from "vitest";
import { SettingsProvider } from "@/components/layout/SettingsProvider";
import { ShutDownScreen } from "@/components/layout/ShutDownScreen";

describe("ShutDownScreen", () => {
  beforeEach(() => {
    // Force reduced-motion so the screen skips straight to the "safe to power
    // off" phase (no 1.5s timer to wait on), and stub the unsupported reload.
    vi.stubGlobal("matchMedia", () => ({
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    vi.stubGlobal("location", { reload: vi.fn() });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("shows the safe-to-power-off screen and reloads on interaction", async () => {
    const user = userEvent.setup();
    render(
      <SettingsProvider>
        <ShutDownScreen />
      </SettingsProvider>,
    );

    const screenEl = screen.getByText(/safe to turn off/i);
    expect(screenEl).toBeInTheDocument();

    await user.click(screenEl);
    expect(window.location.reload).toHaveBeenCalled();
  });
});
