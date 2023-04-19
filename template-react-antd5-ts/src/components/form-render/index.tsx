import { FC, useState } from 'react';
import { Form, Row, DatePicker, TreeSelect, FormInstance } from 'antd';
import { FormLabelAlign } from 'antd/lib/form/interface';
import {
    RadioGroup,
    CheckboxGroup,
    Select,
    Input,
    Search,
    TextArea,
    Upload,
    Password,
    Button
} from './mod/index';
import { isFunction, omit } from 'lodash-es';

const { RangePicker, MonthPicker, WeekPicker, TimePicker } = DatePicker
interface props {
    options?: Array<any>,
    onChange?: ((changedValues: any, values: any) => void) | undefined,
    layout?: "inline" | "horizontal" | "vertical",
    requiredMark?: boolean,
    labelAlign?: FormLabelAlign | undefined,
    labelCol?: object,
    wrapperCol?: object,
    colon?: boolean,
    renderType?: "row",
    gutter?: number,
    preserve?: boolean,
    name?: string,
    initialValues?: object,
    component?: any,
    scrollToFirstError?: any,
    form?: (formInst: FormInstance) => void | undefined,
    wrappedComponentRef?: (formInst: FormInstance) => void | undefined, // 兼容老的antd 3x版本的form render
    onFinish?: ((values: any) => void) | undefined,
    onFinishFailed?: ((errorInfo: any) => void) | undefined,
    onFieldsChange?: ((changedFields: any[], allFields: any[]) => void) | undefined,
    size?: "small" | "middle" | "large",
    renderItem?: (formItem: JSX.Element, item: any, index: number) => JSX.Element,
}

export interface FormRenderPropsType extends props { }
interface IWatcher {
    watch: string,
    setter: string
}

const _FormRender: FC<props> = (props) => {
    const {
        options = [],
        form,
        wrappedComponentRef,
        scrollToFirstError = true,
        component,
        initialValues,
        name,
        preserve,
        onChange,
        onFinish,
        onFinishFailed,
        onFieldsChange,
        layout,
        requiredMark,
        labelAlign,
        labelCol,
        wrapperCol,
        colon,
        renderItem,
        gutter = 0,
        renderType
    } = props
    const [changed, setChanged] = useState(false);

    const [_formInstance] = Form.useForm();

    // 如果form 和 wrappedComponentRef存在 则通过函数将form实例传递到外层
    if (form) {
        form(_formInstance)
    }

    if (wrappedComponentRef) {
        wrappedComponentRef(_formInstance)
    }

    const onChangeInside = (changedValues: any, values: any) => {
        // 用于改变状态 刷新渲染，让 before 、 rules 、 watch 函数执行更新
        setChanged(!changed);
        onChange && onChange(changedValues, values);
    }

    const renderOptions = () => {
        return options && options.map((item, itemIndex) => {


            // block元素必须有render属性
            if (item.type === "block") {
                if (item.render) return item.render(item, itemIndex)
                throw new Error("block must has a render prop")
            }

            item = Object.assign({}, item)
            let Comp: any = FormRender.components[item.type]
            if (!Comp) {
                throw new Error(item.type + " is not defined")
            }

            switch (item.type) {
                case "button":
                    item.form = _formInstance
                    break
                case "radioGroup":
                    if (Array.isArray(item._defaultValue)) {
                        item._defaultValue = item._defaultValue[0]
                    }
                    break
                default:
                    break
            }

            const _children = item.children
            delete item.children

            let rules: any = [];
            // 如果 rules 为函数，则执行之
            if (isFunction(item.rules)) {
                const values = _formInstance.getFieldsValue();
                rules = item.rules(values, _formInstance);
            } else {
                rules = item.rules;
            }

            // before 钩子函数
            const { before } = item;


            const formItem = <Form.Item noStyle key={itemIndex + item.type} shouldUpdate={true}>
                {
                    ({ getFieldsValue }) => {
                        if (before) {
                            const values = getFieldsValue();
                            if (typeof before !== 'function') {
                                throw new Error('before must function');
                            }

                            const result = before(values, _formInstance);
                            if (!(result && result.show)) {
                                return
                            }
                        }

                        return (
                            <Form.Item key={itemIndex + item.type}
                                extra={item.extra}
                                label={item.label}
                                labelCol={item.labelCol}
                                labelAlign={item.labelAlign}
                                dependencies={item.dependencies}
                                wrapperCol={item.wrapperCol}
                                colon={item.colon}
                                hasFeedback={item.hasFeedback}
                                className={item.formItemClassName}
                                initialValue={item.defaultValue}
                                messageVariables={item.messageVariables}
                                name={item.name}
                                hidden={item.hidden}
                                normalize={item.normalize}
                                noStyle={item.noStyle}
                                htmlFor={item.htmlFor}
                                preserve={item.preserve}
                                rules={rules}
                                shouldUpdate={item.shouldUpdate}
                                tooltip={item.tooltip}
                                trigger={item.trigger}
                                validateFirst={item.validateFirst}
                                validateStatus={item.validateStatus}
                                validateTrigger={item.validateTrigger}
                                valuePropName={item.valuePropName}
                                style={item.formItemStyle}>

                                <Comp key={itemIndex + item.type} form={_formInstance} {...omit(item, ['rules', 'formItemStyle', 'defaultValue', 'omitProps', ...(item?.omitProps || [])])} options={_children}></Comp>
                            </Form.Item>
                        )
                    }
                }
            </Form.Item>

            // renderItem高阶函数 用来包裹formItem
            if (renderItem) {
                return renderItem(formItem, item, itemIndex)
            } else {
                return formItem
            }
        })
    }

    return <Form onFieldsChange={onFieldsChange}
        onFinishFailed={onFinishFailed}
        onFinish={onFinish}
        preserve={preserve}
        form={_formInstance}
        initialValues={initialValues}
        scrollToFirstError={scrollToFirstError}
        component={component}
        name={name}
        layout={layout}
        colon={colon}
        wrapperCol={wrapperCol}
        labelCol={labelCol}
        labelAlign={labelAlign}
        requiredMark={requiredMark}
        onValuesChange={onChangeInside}>
        {renderType ? <Row gutter={gutter}>{renderOptions()}</Row> : renderOptions()}
    </Form>
}

type _FormType = typeof _FormRender

export interface FormInterface extends _FormType {
    components: any,
    use: (type: string, component: Function) => void,
    clear: () => void
}

const FormRender = _FormRender as FormInterface
FormRender.components = {
    "radioGroup": RadioGroup,
    "checkboxGroup": CheckboxGroup,
    "select": Select,
    "treeSelect": TreeSelect,
    "input": Input,
    "search": Search,
    "password": Password,
    "textarea": TextArea,
    "datepicker": DatePicker,
    "monthpicker": MonthPicker,
    "rangepicker": RangePicker,
    "weekpicker": WeekPicker,
    "timepicker": TimePicker,
    "button": Button,
    "upload": Upload
}
FormRender.use = (type: string, component: Function) => {
    if (Object.keys(FormRender.components).indexOf(type) == -1) {
        FormRender.components[type] = component
    } else {
        throw new Error(type + " has been used more than twice")
    }
}

FormRender.clear = () => {
    FormRender.components = {}
    init()
}

function init() {
    FormRender.use("radioGroup", RadioGroup)
    FormRender.use("checkboxGroup", CheckboxGroup)
    FormRender.use("select", Select)
    FormRender.use("treeSelect", TreeSelect)
    FormRender.use("input", Input)
    FormRender.use("search", Search)
    FormRender.use("password", Password)
    FormRender.use("textarea", TextArea)
    FormRender.use("datepicker", DatePicker)
    FormRender.use("monthpicker", MonthPicker)
    FormRender.use("rangepicker", RangePicker)
    FormRender.use("weekpicker", WeekPicker)
    FormRender.use("timepicker", TimePicker)
    FormRender.use("button", Button)
    FormRender.use("upload", Upload)
}

export default FormRender;