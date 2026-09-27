import { Table, Tbody } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingSkeleton from "../LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("renders the requested number of four-column table rows", () => {
    const { container } = render(
      <Table>
        <Tbody>
          <LoadingSkeleton rows={3} />
        </Tbody>
      </Table>,
    );

    expect(container.querySelectorAll("tbody tr")).toHaveLength(3);
    expect(container.querySelectorAll("tbody td")).toHaveLength(12);
  });
});
