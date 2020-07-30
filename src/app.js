import React, { useState } from 'react';
import './app.css';
import * as characters from "./data/characters.json";
import * as species from "./data/species.json";
import * as planets from "./data/planets.json";
import { Input, Button, Tabs, Menu } from 'antd';
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
    const [queryText, setQueryText] = useState(exampleQueries[0].text);

    return (
        <div className="flex flex-col p-8 h-screen">
            <div 
                className="flex flex-row"
                style={{
                    height: "58%",
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
                                <div className="h-full w-full flex flex-row">
                                    <div className="h-full">
                                        <Menu 
                                            mode="vertical"
                                            style={{
                                                width: "200px",
                                            }}
                                            >
                                            {exampleQueries.map(exampleQuery => (
                                                <Menu.Item
                                                    className="border-0 border-b border-solid border-gray-300"
                                                    key={exampleQuery.name}
                                                    onClick={() => setQueryText(exampleQuery.text)}
                                                    >
                                                    {exampleQuery.name}
                                                </Menu.Item>
                                            ))}
                                        </Menu>
                                    </div>
                                    <div className="h-full flex-grow">
                                        <TextArea 
                                            style={{
                                                height: "100%",
                                            }}
                                            value={queryText}
                                            onChange={e => setQueryText(e.currentTarget.value)}
                                            />
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
                <div className="w-1/2 h-full">
                    <Tabs type="card">
                        <TabPane tab="Query Result" className="p-2">
                            <div className="p-1 h-full overflow-auto border border-solid border-gray-400">
                                <ReactJson
                                    className="p-1"
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
                <TabPane tab="Data explorer" className="p-2">
                    {DataTables()}
                </TabPane>
            </Tabs>
        </div>
    );
}

//
// Example queries that can be put in the query editor.
//
const exampleQueries = [
    require(`./queries/single-species`).default,
    require(`./queries/single-species-with-nested`).default,
    require(`./queries/all-species`).default,
    require(`./queries/all-species-with-nested`).default,
];

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
