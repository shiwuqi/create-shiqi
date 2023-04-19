import React, { FC } from 'react'
import { Radio } from 'antd'
import { RadioGroupOptionType, RadioGroupProps, RadioGroupButtonStyle, RadioProps } from 'antd/es/radio'
const RadioGroup = Radio.Group

interface props extends RadioGroupProps {

}

const FRRadioGroup: FC<props> = (props) => {

    return <RadioGroup {...props}></RadioGroup>
}

export default FRRadioGroup
