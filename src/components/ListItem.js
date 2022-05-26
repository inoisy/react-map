import React from 'react';

export default function ListItem (props) {
    return (
        <div className="ListItem" style={{
            height: props.height + 'px',
            top: props.index * props.height + 'px',
        }}>
            <div className="ListItem--inner">
                <div className="ListItem--row">
                    <div className="ListItem--name">{props.name}</div>
                    <div className="ListItem--price">{props.price}&#8381;</div>
                </div>            
                <div className="ListItem--type">{props.type}</div>
            </div>            
        </div>
    )
}