import React, { useState, useEffect } from 'react';
import './app.css';
import * as characters from "./data/characters.json";
import * as species from "./data/species.json";
import * as planets from "./data/planets.json";
import { Input, Button, Tabs, Menu } from 'antd';
import t from 'typy';
import { CloseOutlined, CaretRightFilled, DownOutlined, UpOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import ReactJson from "react-json-view";
import json5 from "json5";
import { miniql } from "miniql";
import { createQueryResolver } from "@miniql/inline";
import MonacoEditor from 'react-monaco-editor';
import * as Space from 'react-spaces';
import { serializeError } from 'serialize-error';
const { Search } = Input;
const { TabPane } = Tabs;

const mediaQuery = window.matchMedia(`(min-width: 1000px)`);
const onDesktop = mediaQuery.matches;

//
// Renders the application.
//
function App() {
    const defaultQuery = exampleQueries[0];
    const [queryText, setQueryText] = useState(defaultQuery.text);
    const [queryResult, setQueryResult] = useState(undefined);
    const [showDataExplorer, setShowDataExplorer] = useState(onDesktop);
    const [showHeader, setShowHeader] = useState(onDesktop);
    const [showSampleQueries, setShowSampleQueries] = useState(onDesktop);
    const [monacoEditor, setMonacoEditor] = useState(undefined); //TODO: This shouldn't be state.

    //
    // Execute a query and display the results.
    //
    async function executeQuery(queryText) {
        try {
            const query = json5.parse(queryText);
            console.log("Executing query:");
            console.log(query);
            const result = await miniql(query, inlineQueryResolver, { verbose: true });
            console.log("Setting query result:");
            console.log(result);
            setQueryResult(result);
        }
        catch (err) {
            console.error("An error occured running the query:");
            console.error(err && err.stack || err);
            setQueryResult({ error: serializeError(err) });
        }
    }

    if (queryResult === undefined) {
        executeQuery(defaultQuery.text);
    }

    //
    // Function called before Monaco Editor mounts.
    //
    function editorWillMount(monaco) {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            allowComments: true,
            schemas: [{
                fileMatch: ['*'],
                schema: createJsonSchema(),
            }]
        });
    } 

    //
    // Function called when Monaco Editor mounts.
    //
    function editorDidMount(editor, monaco) {
        setMonacoEditor(editor);
    }    

    function layoutEditor() {
        requestAnimationFrame(() => { // This is a hack to make sure the DOM has finished rendering before resizing the editor.
            if (monacoEditor) {
                monacoEditor.layout();
            }
        });
    }

    useEffect(() => {
        layoutEditor(); // Re-layout the editor when panels are resized.
    }, [showDataExplorer, showHeader, showSampleQueries]);

    return (
        <Space.ViewPort>
            <Space.Top
                className="pt-2 pl-2 pr-2"
                size={showHeader ? (onDesktop ? "14.75em" : "20em") : "7.5em"}
                >
                <div
                    className="bg-white"
                    >
                    <div 
                        className="flex flex-row items-start pt-3 pl-4 pr-4 pb-1"
                        >
                        <Button
                            className="mr-4 mb-2 mt-2"
                            icon={showHeader ? <UpOutlined /> : <DownOutlined /> }
                            onClick={() => {
                                setShowHeader(!showHeader);
                            }}
                            />
                        <div className="flex flex-col">
                            <h1>MiniQL interactive example</h1>
                            <div>
                                Best viewed on desktop.
                            </div>
                        </div>
                    </div>
                    <div className="pl-16 p-4 border-0 border-t-4 border-gray-300 border-solid">
                        <div>
                            MiniQL is a tiny JSON-based query language inspired by GraphQL.
                        </div>

                        <a target="_blank" href="https://github.com/miniql/miniql">Learn more about MiniQL</a>. 
                        <a className="ml-2" target="_blank" href="https://github.com/miniql/miniql-interactive-example">See the tech used in this example</a>.  

                        <div>
                            This example allows you to make queries against <a target="_blank" href="https://www.kaggle.com/jsphyg/star-wars/data">Star Wars universe data</a>.
                        </div>
                    </div>
                </div>
            </Space.Top>
            <Space.Fill>
                <Space.Left 
                    size={showSampleQueries ? "20em" : "5em"}
                    className="pl-2 pt-2 overflow-hidden"
                    >
                    <Tabs type="card">
                        <TabPane 
                            tab={(
                                <div className="flex flex-row items-center">
                                    <Button
                                        className="mr-2 pl-2"
                                        icon={showSampleQueries ? <LeftOutlined /> : <RightOutlined />}
                                        onClick={() => {
                                            setShowSampleQueries(!showSampleQueries);
                                        }}
                                        />
                                    {showSampleQueries 
                                        && <div>
                                            Sample queries
                                        </div>
                                    }
                                </div>
                            )}
                            className="p-1 overflow-y-auto"
                            >
                            <Menu 
                                mode="vertical"
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
                        </TabPane>
                    </Tabs>
                </Space.Left>

                <Space.Fill>
                    <Space.Left size="50%" className="pl-2 pt-2">
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
                                            onClick={() => executeQuery(queryText)}
                                            />
                                    </div>
                                )}
                                className="p-1"
                                >
                                <MonacoEditor
                                    language="json"
                                    value={queryText}
                                    onChange={setQueryText}
                                    options={{
                                        minimap: {
                                            enabled: false,
                                        },
                                        contextmenu: false,
                                        automaticLayout: true,
                                    }}
                                    editorWillMount={editorWillMount}
                                    editorDidMount={editorDidMount}
                                    />
                            </TabPane>
                        </Tabs>
                    </Space.Left>

                    <Space.Right size="50%" className="pl-2 pr-2 pt-2">
                        <Tabs type="card">
                            <TabPane tab="Query Result" className="h-full p-2">
                                <div className="p-1 h-full overflow-auto">
                                    <ReactJson
                                        className="p-1 h-full"
                                        src={queryResult}
                                        />
                                </div>
                            </TabPane>
                        </Tabs>
                    </Space.Right>
                </Space.Fill>
            </Space.Fill>
            <Space.Bottom 
                className="p-2"
                size={showDataExplorer ? "25em" : "5em"}
                >
                <Tabs type="card" size="small">
                    <TabPane 
                        tab={(
                            <div className="flex flex-row items-center">
                                <div>
                                    Data explorer
                                </div>
                                <Button
                                    className="ml-4 pl-2"
                                    icon={showDataExplorer ? <DownOutlined /> : <UpOutlined /> }
                                    onClick={() => {
                                        setShowDataExplorer(!showDataExplorer);
                                    }}
                                    />
                            </div>
                        )}
                        className="p-2"
                        >
                        {DataTables()}
                    </TabPane>
                </Tabs>
            </Space.Bottom>
        </Space.ViewPort>
    );
}


//
// Configures the query resolver.
//
const jsonQueryResolverConfig = {
    entities: {
        character: {
            primaryKey: "name",
            jsonFilePath: "./data/planets.json",
            nested: {
                homeworld: {
                    from: "planet",
                },
                species: {
                },
            },
        },
        species: {
            primaryKey: "name",
            nested: {
                homeworld: {
                    from: "planet",
                },
            },
        },
        planet: {
            primaryKey: "name",
            nested: {
                species: {
                    foreignKey: "homeworld",
                },
                characters: {
                    from: "character",
                    multiple: true,
                    parentKey: "name",
                    foreignKey: "homeworld"
                },
            },
        },
    },
    verbose: true,
};

//
// Inline data to run queries against.
//
const inlineData = {
    character: characters.default,
    species: species.default,
    planet: planets.default,
};

//
// Resolves MiniQL queryies.
//
const inlineQueryResolver = createQueryResolver(jsonQueryResolverConfig, inlineData);

//
// Example queries that can be put in the query editor.
//
const exampleQueries = [
    require(`./queries/get-vader`).default,
    require(`./queries/get-vader-with-homeworld`).default,
    require(`./queries/get-vader-with-homeworld-and-species`).default,
    require(`./queries/get-vader-with-homeworld-and-nested-characters`).default,
    require(`./queries/get-hutt-species`).default,
    require(`./queries/get-all-species`).default,
    require(`./queries/get-all-species-with-homeworld`).default,
];

//
// Creates a JSON schema for our data format.
// This function returns a JSON schema: https://json-schema.org/understanding-json-schema/
//
function createJsonSchema() {
    return {
        type: "object",
        properties: {
            get: {
                type: "object",
                properties: createEntitiesSchema(),
                additionalProperties: false,
            },
            additionalProperties: false,
        },
        additionalProperties: false,
    };
}

//
// Create JSON schemas for all the entities.
// This function returns a JSON schema: https://json-schema.org/understanding-json-schema/
//
function createEntitiesSchema() {
    const entitiesSchema = {};
    for (const dataset of datasets) {
        entitiesSchema[dataset.entityName] = {
            type: "object",
            properties: {
                args: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                        },
                    },
                    additionalProperties: false,
                },
                resolve: {
                    type: "object",
                    //TODO: Flesh this out further according to what can be resolved.
                },  
            },
            additionalProperties: false,
        };
    }

    return entitiesSchema;
}

//
// Datasets that can be queried.
//
const datasets = [
    { 
        name: "Characters", 
        entityName: "character",
        data: characters,
    }, 
    { 
        name: "Species", 
        entityName: "species",
        data: species,
    }, 
    { 
        name: "Planets", 
        entityName: "planet",
        data: planets,
    }, 
];

//
// Renders the data tables.
//
function DataTables() {
    const [searchText, setSearchText] = useState("");

    return (
        <div className="h-full">
            <div className="ml-3 mt-2 flex flex-row items-center">
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

            <div className="m-4 h-full">
                <Tabs size="small">
                    {datasets.map(dataset => 
                        <TabPane tab={dataset.name} key={dataset.name}>
                            <div className="pt-4 h-full overflow-auto">
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
