import { Skeleton, Td, Tr } from "@chakra-ui/react";

export default function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <Tr key={index}>
          <Td>
            <Skeleton height="20px" />
          </Td>
          <Td>
            <Skeleton height="20px" />
          </Td>
          <Td>
            <Skeleton height="20px" width="80px" />
          </Td>
          <Td>
            <Skeleton height="20px" width="100px" />
          </Td>
        </Tr>
      ))}
    </>
  );
}
