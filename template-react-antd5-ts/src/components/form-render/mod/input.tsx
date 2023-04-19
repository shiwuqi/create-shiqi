import React, { FC } from 'react'
import { Input } from 'antd'

interface props {
    className?: string,
    style?: object,
    addonAfter?: JSX.Element,
    addonBefore?: JSX.Element,
    disabled?: boolean,
    id?: string,
    value: any,
    prefix?: JSX.Element,
    placeholder?: string,
    size?: "large" | "middle" | "small",
    suffix?: JSX.Element,
    type?: string,
    onPressEnter?: (e: any) => any,
    allowClear?: boolean,
    autoFocus?: boolean,
    maxLength?: number,
    bordered?: boolean,
    onChange: (e: any) => void
}

const FRInput: FC<props> = (props) => {
    const {
        className,
        style,
        addonAfter,
        addonBefore,
        disabled,
        id,
        value,
        prefix,
        placeholder,
        size,
        type,
        onPressEnter,
        allowClear,
        autoFocus,
        maxLength,
        bordered,
        suffix,
        onChange
    } = props

    function handleSuffix() {
        if(maxLength && !suffix) {
            return <div style={{ color: "#8c8c8c" }}>{ `${ value && value.length || 0 } / ${ maxLength }` }</div>
        } else {
            return suffix
        }
    }

    return <Input value={value}
        className={className}
        style={style}
        addonAfter={addonAfter}
        addonBefore={addonBefore}
        disabled={disabled}
        id={id}
        autoFocus={ autoFocus }
        prefix={prefix}
        placeholder={placeholder}
        size={size}
        type={type}
        onChange={ onChange }
        suffix={ handleSuffix() }
        bordered={bordered}
        onPressEnter={onPressEnter}
        allowClear={allowClear}
        maxLength={maxLength}
    ></Input>
}

export default FRInput