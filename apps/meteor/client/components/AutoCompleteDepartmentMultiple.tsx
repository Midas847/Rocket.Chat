import { PaginatedMultiSelectFiltered } from '@rocket.chat/fuselage';
import { useDebouncedValue } from '@rocket.chat/fuselage-hooks';
import { useTranslation } from '@rocket.chat/ui-contexts';
import type { FormEventHandler } from 'react';
import React, { memo, useMemo, useState } from 'react';

import { useRecordList } from '../hooks/lists/useRecordList';
import { AsyncStatePhase } from '../hooks/useAsyncState';
import { useDepartmentsList } from './Omnichannel/hooks/useDepartmentsList';

type AutoCompleteDepartmentMultipleProps = {
	value?: string;
	onChange: FormEventHandler<HTMLElement>;
	onlyMyDepartments?: boolean;
	showArchived?: boolean;
};

const AutoCompleteDepartmentMultiple = ({
	value,
	onlyMyDepartments = false,
	showArchived = false,
	onChange = () => undefined,
}: AutoCompleteDepartmentMultipleProps) => {
	const t = useTranslation();
	const [departmentsFilter, setDepartmentsFilter] = useState('');

	const debouncedDepartmentsFilter = useDebouncedValue(departmentsFilter, 500);

	const { itemsList: departmentsList, loadMoreItems: loadMoreDepartments } = useDepartmentsList(
		useMemo(
			() => ({ filter: debouncedDepartmentsFilter, onlyMyDepartments, ...(showArchived && { showArchived: true }) }),
			[debouncedDepartmentsFilter, onlyMyDepartments, showArchived],
		),
	);

	const { phase: departmentsPhase, items: departmentsItems, itemCount: departmentsTotal } = useRecordList(departmentsList);

	return (
		<PaginatedMultiSelectFiltered
			withTitle
			value={value}
			onChange={onChange}
			filter={departmentsFilter}
			setFilter={setDepartmentsFilter as (value?: string | number) => void}
			options={departmentsItems}
			width='100%'
			flexShrink={0}
			flexGrow={0}
			placeholder={t('Select_an_option')}
			endReached={
				departmentsPhase === AsyncStatePhase.LOADING
					? () => undefined
					: (start?: number) => {
							if (start === undefined) {
								return;
							}
							return loadMoreDepartments(start, Math.min(50, departmentsTotal));
					  }
			}
		/>
	);
};

export default memo(AutoCompleteDepartmentMultiple);
