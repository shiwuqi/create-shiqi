import { FC, ReactNode } from 'react';
import { Checkbox } from 'antd';
import { CheckboxGroupProps, CheckboxOptionType } from 'antd/es/checkbox';

const CheckGroup = Checkbox.Group;

interface checkboxItem extends CheckboxOptionType {
}

interface props extends CheckboxGroupProps {
    options: Array<checkboxItem>,
    render?: (checkboxItemInstance: any, checkboxItem: checkboxItem, props: any, index: number) => unknown
}

const FRCheckboxGroup: FC<props> = (props) => {

    const { options, render } = props

    const renderCheckbox = (): any => {
        return options.map((each, index) => {
            if (render) {
                return render(() => {
                    return <Checkbox disabled={each.disabled} value={each.value} key={each.value.toString()}>{each.label}</Checkbox>
                }, each, props, index)
            } else {
                return <Checkbox disabled={each.disabled} value={each.value} key={each.value.toString()}>{each.label}</Checkbox>
            }
        })
    }

    return <CheckGroup {...props}>
        {renderCheckbox()}
    </CheckGroup>
}

export default FRCheckboxGroup
