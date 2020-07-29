import React from 'react';
import './app.css';
import * as characters from "./data/characters.json";

function App() {
    
    const columns = Object.keys(characters.default[0]);
    const data = characters.default;

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {columns.map(columnName => 
                            <th key={columnName}>
                                {columnName}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map(record => 
                        <tr key={record.name}>
                            {columns.map(columnName => 
                                <td key={`${record.name}-${columnName}`}>
                                    {record[columnName]}
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>

            <pre>
                {JSON.stringify(characters, null, 4)}
            </pre>
        </div>
    );
}

export default App;
