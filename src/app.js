import React, { useState } from 'react';
import './app.css';
import * as characters from "./data/characters.json";
import { Input } from 'antd';
import t from 'typy';
const { Search } = Input;

//
// Renders the application.
//
function App() {
    return (
        <div className="flex flex-col p-8">
            {DataTable(characters.default)}
        </div>
    );
}

//
// Renders a data table.
//
function DataTable(data) {
    const [searchText, setSearchText] = useState("");
    const columnNames = Object.keys(data[0]);

    return (
        <div>
            <Search
                enterButton="Search"
                placeholder="Enter search text"
                onSearch={setSearchText}
                style={{
                    width: "400px",
                }}
                />

            <div className="mt-4">
                <table>
                    <thead>
                        <tr>
                            {columnNames.map(columnName => 
                                <th key={columnName}>
                                    {columnName}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data
                            .filter(filterData(searchText, columnNames))
                            .map(record => 
                                <tr key={record.name}>
                                    {columnNames.map(columnName => 
                                        <td key={`${record.name}-${columnName}`}>
                                            {record[columnName]}
                                        </td>
                                    )}
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

//
// Helper function to filter data.
//
function filterData(searchText, columnNames) {
    return record => {
        if (searchText === "") {
            return true;
        }
        else {
            for (const columnName of columnNames) {
                const value = record[columnName];
                if (t(value).isString) {
                    if (value.toLowerCase().includes(searchText.trim().toLowerCase())) {
                        return true;
                    }
                }
            }
            return false;
        }
    };
}


export default App;
