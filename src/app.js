import React, { useState } from 'react';
import './app.css';
import * as characters from "./data/characters.json";
import * as species from "./data/species.json";
import * as planets from "./data/planets.json";
import { Input, Button, Tabs } from 'antd';
import t from 'typy';
import { CloseOutlined, CaretRightFilled } from '@ant-design/icons';
import ReactJson from "react-json-view";
const { Search } = Input;
const { TabPane } = Tabs;
const { TextArea } = Input;

//
// Renders the application.
//
function App() {
    return (
        <div className="flex flex-col p-8 h-screen">
            <div 
                className="flex flex-row"
                style={{
                    height: "50%",
                }}
                >
                <div className="w-1/2 h-full">
                    <Tabs type="card">
                        <TabPane 
                            tab={(
                                <div className="flex flex-row items-center">
                                    <div>
                                        Query 
                                    </div>
                                    <Button
                                        className="ml-4 pl-2"
                                        icon={<CaretRightFilled />}
                                        />
                                </div>
                            )}
                            className="p-1"
                            >
                            <div className="p-1 h-full overflow-auto">
                                <TextArea
                                    style={{
                                        height: "100%",
                                    }}
                                    />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <div className="w-1/2 h-full">
                    <Tabs type="card">
                        <TabPane tab="Query Result" className="p-1">
                            <div className="p-1 h-full overflow-auto border border-solid border-gray-400">
                                <ReactJson
                                    src={characters.default}
                                    />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
            
            <Tabs 
                className="mt-2"
                type="card"
                style={{
                    height: "40%",
                }}
                >
                <TabPane tab="Data explorer" className="p-1">
                    {DataTables()}
                </TabPane>
            </Tabs>
        </div>
    );
}

//
// Renders the data tables.
//
function DataTables() {
    const [searchText, setSearchText] = useState("");

    const datasets = [
        { name: "Characters", data: characters }, 
        { name: "Species", data: species }, 
        { name: "Planets", data: planets }, 
    ];

    return (
        <div className="h-full">
            <div className="flex flex-row items-center">
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

            <div className="mt-4 h-full">
                <Tabs type="card">
                    {datasets.map(dataset => 
                        <TabPane tab={dataset.name} key={dataset.name}>
                            <div className="p-2 pt-4 h-full overflow-auto">
                                <DataTable
                                    searchText={searchText}
                                    data={dataset.data.default}
                                    />
                            </div>
                        </TabPane>
                    )}
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
