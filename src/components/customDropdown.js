import React, { useState } from 'react'
import { Form } from 'react-bootstrap';

export const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = useState('');
        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <Form.Control
                autoFocus
                className="mx-3 my-2 w-auto"
                placeholder="Type to filter..."
                onChange={(e) => setValue(e.target.value)}
                value={value}
                />
                <ul className="list-unstyled">
                {React.Children.toArray(children).filter(
                    (child) =>
                    !value || child.props.children.toLowerCase().startsWith(value.toLowerCase()),
                )}
                </ul>
            </div>
        );
    },
);


export const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href="#"
      ref={ref}
      style={{ color:'#fff', textDecoration:'none' }}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
));

