<script lang="ts">
	import { goto } from '$app/navigation';

	let {
		columns,
		rows,
		caption
	}: {
		columns: {
			key: string;
			label: string;
			url?: boolean;
		}[];
		rows: Array<Record<string, unknown>>;
		caption: string;
	} = $props();

	let sortingColumn = $state(0);
	let sortDirection = $state(-1); // 1 for ascending, -1 for descending

	function sortRows() {
		sortedRows = [...rows].sort((a, b) => {
			// Sort by the current column
			const key = columns[sortingColumn].key;
			const aValue = a[key];
			const bValue = b[key];

			// Add type safety by handling different types appropriately
			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return sortDirection * aValue.localeCompare(bValue);
			} else if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortDirection * (aValue - bValue);
			} else if (aValue instanceof Date && bValue instanceof Date) {
				return sortDirection * (aValue.getTime() - bValue.getTime());
			} else {
				// Convert to strings as a fallback for other types
				return sortDirection * String(aValue).localeCompare(String(bValue));
			}
		});
	}

	function handleSort(index: number) {
		if (sortingColumn === index) {
			// Toggle sort direction if clicking the same column
			sortDirection *= -1;
		} else {
			// New column, reset to descending
			sortingColumn = index;
			sortDirection = -1;
		}
		sortRows();
	}

	let sortedRows = $derived([...rows]);
	sortRows(); // Initial sort
</script>

<div class="table-wrap">
	<table class="table caption-bottom">
		<caption class="pt-4">{caption}</caption>
		<thead>
			<tr>
				{#each columns as column, index (column.key)}
					<th>
						<button on:click={() => handleSort(index)}>
							{column.label}
							{#if sortingColumn === index}
								{sortDirection > 0 ? '▲' : '▼'}
							{/if}
						</button>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="[&>tr]:hover:preset-tonal-primary">
			{#each sortedRows as row (row.index)}
				<tr>
					{#each columns as column (column.key)}
						<td>
							{#if column.url}
								<button
									type="button"
									class="btn preset-outlined-surface-500 min-w-[8ch]"
									on:click={() => goto(row.url as string)}
								>
									{row[column.key]}
								</button>
							{:else}
								{row[column.key]}
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
