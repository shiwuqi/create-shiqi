import { useCallback } from 'react'

type UsePaginationType = {
    total: number;
    pageNum: number;
    pageSize: number;
    onChange?: (params: {
        pageNum: number, pageSize: number
    }) => void;
}

const usePagination = (props: UsePaginationType) => {

    const { total, pageNum, pageSize, onChange } = props

    const handleOnChange = useCallback(
        (num: number, size: number) => {
            if (pageSize !== size) {
                num = 1;
            }
            onChange && onChange({
                pageNum: num,
                pageSize: size
            });
        },
        [pageSize, onChange]
    )

    return {
        hideOnSinglePage: false,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total: number) => `第 ${(pageNum - 1) * pageSize + 1}-${pageNum * pageSize} 条/总共 ${total} 条`,
        pageSize: pageSize,
        total: total,
        current: pageNum,
        onChange: handleOnChange,
    }
};

export default usePagination;