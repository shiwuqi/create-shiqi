import { FC } from 'react';
import { Button } from 'antd';

interface props {
    form: any,
    onClick?: (values: any, formInstance: any) => void | undefined,
    className?: string | undefined,
    style?: object | undefined,
    group?: boolean,
    children?: Array<any>,
    buttonType?: "default" | "primary" | "ghost" | "dashed" | "link" | "text" | undefined,
    text?: string,
    disabled?: boolean,
    ghost?: boolean,
    href?: string,
    htmlType?: "button" | "submit" | "reset" | undefined,
    icon?: JSX.Element | undefined,
    loading?: boolean,
    shape?: "circle" | "round" | undefined,
    size?: "large" | "middle" | "small",
    target?: string,
    block?: boolean,
    render?: (values: any, formInstance: any) => JSX.Element
}

const FRButton: FC<props> = (props) => {
    const { onClick, form, className, style, group, children, buttonType, text, disabled, ghost, href, htmlType, icon, loading, shape, size, target, block, render } = props

    const handleClick = () => {
        if (onClick) {
            const values = form.getFieldsValue()

            let keys = Object.keys(values)
            keys.forEach(each => {
                if (values[each] === undefined) {
                    delete values[each]
                }
            })

            onClick(values, form)
        }
    }

    if (render) {
        return render(form.getFieldsValue(), form)
    } else if (group) {
        if (!children) {
            throw "button must has children props when group is true"
        }

        return <Button.Group size={size}>
            {
                children.map((each, index) => {
                    if (each.render) {
                        return each.render(each, form)
                    }

                    let _iconAlign = each.iconAlign || "left"
                    delete each.iconAlign

                    return <Button key={index} onClick={() => each.onClick(each)}
                        className={each.className}
                        style={each.style}
                        type={each.buttonType}
                        ghost={each.ghost}
                        href={each.href}
                        shape={each.shape}
                        loading={each.loading}
                        htmlType={each.htmlType}
                        disabled={each.disabled}>
                        {each.icon && _iconAlign === "left" ? each.icon : null}
                        {each.text}
                        {each.icon && _iconAlign === "right" ? each.icon : null}
                    </Button>
                })
            }
        </Button.Group>
    } else {
        return <Button onClick={handleClick} className={className}
            style={style}
            type={buttonType}
            ghost={ghost}
            href={href}
            size={size}
            icon={icon}
            shape={shape}
            target={target}
            loading={loading}
            htmlType={htmlType}
            block={block}
            disabled={disabled}>
            {text}
        </Button>
    }
}

export default FRButton