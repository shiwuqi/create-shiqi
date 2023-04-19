import React, { FC } from 'react'
import { Select } from 'antd'
import { SelectProps } from 'antd/es/select'

interface props extends SelectProps<{
    mode?: 'multiple' | 'tags';
}>{}

const FRSelect: FC = (props) => {
    return <Select {...props}></Select>
} 

export default FRSelect