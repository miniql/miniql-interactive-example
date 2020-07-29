import React, { useState } from 'react';
import './app.css';
import * as characters from "./data/characters.json";
import { Input, Button, Tabs } from 'antd';
import t from 'typy';
import { CloseOutlined } from '@ant-design/icons';
const { Search } = Input;
const { TabPane } = Tabs;

//
// Renders the application.
//
function App() {
    return (
        <div className="flex flex-col p-8">
            {DataTables()}
        </div>
    );
}

//
// Renders the data tables.
//
function DataTables() {
    const [searchText, setSearchText] = useState("");

    return (
        <div>
            <div 
                className="flex flex-row items-center"
                >
                <Search
                    enterButton="Search"
                    placeholder="Enter search text"
                    onSearch={setSearchText}
                    style={{
                        width: "400px",
                    }}
                    />

                {searchText !== ""
                    && <Button
                        className="ml-1"
                        icon={<CloseOutlined />}
                        onClick={() => setSearchText("")}
                        >
                    </Button>
                }
            </div>

            <div className="mt-4 card-container">
                <Tabs type="card">
                    <TabPane tab="Tab 1" key="1">
                        <div className="p-1">
                            <DataTable
                                searchText={searchText}
                                data={characters.default}
                                />
                        </div>
                    </TabPane>
                    <TabPane tab="Tab 2" key="2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="Tab 3" key="3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

//
// Renders a data table.
//
function DataTable({ searchText, data }) {
    const columnNames = Object.keys(data[0]);

    return (
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
