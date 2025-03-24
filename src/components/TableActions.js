// src/components/TableActions.js
import React from 'react';
import { MdModeEdit, MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export const TableRow = ({ item, index, onEdit, onDelete }) => {
  return (
    <tr key={index} className="table_row urlsPage">
      <td className="ellipsis">
        <OverlayTrigger
          placement='top'
          overlay={
            <Tooltip id={`tooltip-top`}>
              <strong>{item['title']}</strong>
            </Tooltip>
          }
        >
          <span>{item["title"]}</span>
        </OverlayTrigger>
      </td>
      <td>
        <Link 
          className="ellipsis" 
          to={item["source"]} 
          target="_blank" 
          style={{ color: "blue", textDecoration:"underline" }}
        >
          {item["source"]}
        </Link>
      </td>
      <td style={{ alignContent:'center', textTransform:'capitalize' }}>
        {item['type']}
      </td>
      <td>
        {item['published']}
      </td>
      <td>
        <div className="flex gap-6 items-center">
          <MdModeEdit 
            className="text-xl cursor-pointer" 
            onClick={() => onEdit(item)}
          />
          <MdDelete 
            className="text-xl cursor-pointer" 
            onClick={() => onDelete(item)}
          />
        </div>
      </td>
    </tr>
  );
};