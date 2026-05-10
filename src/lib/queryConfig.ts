import { QueryClient, type UseQueryOptions, QueryKey } from '@tanstack/react-query';

// --- Cache Duration Presets ---

/** Real-time data (staleTime 0) - used for data that must always be fresh (e.g. live events) */
const REALTIME = {
	staleTime: 0,
	gcTime: 1 * 60 * 1000, // 1 minute garbage collection
} as const;

/** Default cache (5 min stale, 10 min gc) - suitable for most list views */
const DEFAULT = {
	staleTime: 5 * 60 * 1000,
	gcTime: 10 * 60 * 1000,
} as const;

/** Static data (30 min stale, 60 min gc) - for rarely changing data like plan definitions */
const STATIC = {
	staleTime: 30 * 60 * 1000,
	gcTime: 60 * 60 * 1000,
} as const;

const QUERY_PRESETS = { REALTIME, DEFAULT, STATIC } as const;

type QueryPreset = typeof REALTIME | typeof DEFAULT | typeof STATIC;

// --- createQueryConfig ---

interface QueryConfigOverrides {
	/** Override stale time in milliseconds */
	staleTime?: number;
	/** Override garbage collection time in milliseconds */
	gcTime?: number;
}

interface QueryConfigOptions<
	TQueryFnData = unknown,
	TError = Error,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
> {
	/** TanStack Query key */
	queryKey: TQueryKey;
	/** Query function */
	queryFn: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>['queryFn'];
	/** Base preset to use (defaults to DEFAULT) */
	preset?: QueryPreset;
	/** Per-call overrides for staleTime and gcTime */
	overrides?: QueryConfigOverrides;
	/** Whether the query is enabled */
	enabled?: boolean;
}

/**
 * `createQueryConfig` builds a standardized TanStack Query (v5) configuration object
 * with consistent caching defaults and per-call override support.
 */
function createQueryConfig<
	TQueryFnData = unknown,
	TError = Error,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
>({
	queryKey,
	queryFn,
	preset = DEFAULT,
	overrides,
	enabled,
}: QueryConfigOptions<TQueryFnData, TError, TData, TQueryKey>): UseQueryOptions<
	TQueryFnData,
	TError,
	TData,
	TQueryKey
> {
	return {
		queryKey,
		queryFn,
		staleTime: overrides?.staleTime ?? preset.staleTime,
		gcTime: overrides?.gcTime ?? preset.gcTime,
		enabled,
	};
}

/**
 * `createQueryClient` initializes a new TanStack QueryClient with the global
 * default caching settings defined in the assignment requirements.
 */
function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: DEFAULT.staleTime,
				gcTime: DEFAULT.gcTime,
				retry: 1,
				refetchOnWindowFocus: false,
			},
		},
	});
}

export { createQueryConfig, createQueryClient, QUERY_PRESETS, REALTIME, DEFAULT, STATIC };
export type { QueryConfigOverrides, QueryConfigOptions, QueryPreset };
