import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SettingsProvider } from "@/components/layout/SettingsProvider";
import { DateTimeDialog } from "@/components/layout/DateTimeDialog";

describe("DateTimeDialog", () => {
  it("renders the clock and closes via OK", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <SettingsProvider>
        <DateTimeDialog open onClose={onClose} />
      </SettingsProvider>,
    );

    expect(
      screen.getByRole("dialog", { name: /date\/time/i }),
    ).toBeInTheDocument();
    // The analog clock is an SVG with an img role + time label.
    expect(screen.getByRole("img")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ok/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
