jest.mock("~/trpc/react", () => ({
  api: {
    item: {
      getNextItemNumber: {
        useQuery: () => ({
          refetch: jest.fn().mockResolvedValue({ data: 43 }),
        }),
      },
      create: {
        useMutation: () => ({
          mutate: jest.fn(),
          isPending: false,
        }),
      },
      update: {
        useMutation: () => ({
          mutate: jest.fn(),
          isPending: false,
        }),
      },
      getAll: {
        useQuery: () => ({ data: [] }),
      },
      options: {
        useQuery: () => ({
          data: [{ label: "Alege articolul", value: "" }],
        }),
      },
    },
    location: {
      getAll: {
        useQuery: () => ({ data: [] }),
      },
      options: {
        useQuery: () => ({
          data: [{ label: "Alege locatia", value: "" }],
        }),
      },
      create: {
        useMutation: () => ({
          mutate: jest.fn(),
          isPending: false,
        }),
      },
    },
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock("superjson", () => ({}));
