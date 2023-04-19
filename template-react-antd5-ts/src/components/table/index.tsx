import { useState, useEffect, useMemo, forwardRef, ForwardedRef, useImperativeHandle } from 'react';
import { Empty, Table as ATable, TableProps as ATableProps } from 'antd';
import { QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { usePagination } from '@/hooks';
import request from '@/utils/request';

interface IProps extends ATableProps<any> {
    url?: string;
    requestdata?: object;
    pageNum?: number;
    pageSize?: number;
    dataSource?: any[];
    datamapping?: string;
    queryConfig?: QueryObserverOptions<any>;
    columns?: any[];
    hiddenPagination?: boolean;
}

const Table = (props: IProps, ref: ForwardedRef<unknown>) => {
    const { url, requestdata = {}, pageNum: num = 1, pageSize: size = 10, dataSource, queryConfig = {},
        datamapping, locale, hiddenPagination, ...rest } = props;

    const [page, setPage] = useState({
        pageNum: num,
        pageSize: size,
    });

    const { pageNum, pageSize } = page;

    const requestdataStr = JSON.stringify(requestdata);

    const requestdataMemo = useMemo(() => {
        setPage(val => ({ ...val, pageNum: 1 }));
        return JSON.parse(requestdataStr);
    }, [requestdataStr]);

    const {
        data,
        refetch,
        isLoading,
    } = useQuery<Page<any>>([url, requestdataMemo, { pageNum: pageNum, pageSize: pageSize }], () => {
        const obj = {
            pageNum,
            pageSize,
            ...requestdataMemo,
        };
        if (!url) {
            return Promise.resolve({
                records: [],
                list: [],
                total: options?.length || 0,
                pageNum,
                pageSize,
                totalPage: 0,
            });
        }
        return request(url, {
            method: 'post',
            params: obj,
        });
    }, {
        cacheTime: 0,
        ...queryConfig,
    });

    const pagination = usePagination({
        total: (data as any)?.total || 0,
        pageNum,
        pageSize,
        onChange: setPage,
    });

    const options: any = useMemo(() => {
        return url ? (data as any)?.[datamapping || 'records'] : dataSource;
    }, [url, data, dataSource]);

    useEffect(() => {
        // 当当前页只有一条数据并且 pageNo 不等于 1 的时候
        setPage((prev) => ({ ...prev, pageNum: num }));
    }, [num]);

    useImperativeHandle(ref, () => ({
        refetch: refetch,
    }));

    return (
        <ATable
            size='middle'
            locale={{
                emptyText: (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />),
                ...locale,
            }}
            dataSource={options}
            loading={isLoading}
            pagination={hiddenPagination ? false : pagination}
            {...rest}
        />
    );
};

export default forwardRef(Table);