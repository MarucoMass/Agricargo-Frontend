const ReusableTable = ({ columns, data, actions, statusColumn }) => {
  const statusStyles = {
    Finalizado: "bg-red-100 text-red-800",
    "En viaje": "bg-green-100 text-green-800",
    "En preparación": "bg-yellow-100 text-yellow-800",
  };

  const renderHeader = () => {
    return (
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {columns.map((col, index) => (
            <th key={index} scope="col" className="px-6 py-3">
              {col}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderRows = () => {
    return data.map((item, rowIndex) => (
      <tr
        key={rowIndex}
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      >
        {Object.keys(item).map((key, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            {statusColumn && key === statusColumn ? (
              <span
                className={`py-2 px-3 rounded-xl ${statusStyles[item[key]]}`}
              >
                {item[key]}
              </span>
            ) : (
              item[key]
            )}
          </td>
        ))}
        {actions && renderActions(item)}
      </tr>
    ));
  };

  const renderActions = (item) => {
    return (
      <td className="px-6 py-4">
        {actions.map((action, actionIndex) => (
          <button
            key={actionIndex}
            onClick={() => action.handler(item)}
            className={`px-4 py-2 mx-1 text-white rounded-lg ${action.className}`}
          >
            {action.label}
          </button>
        ))}
      </td>
    );
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        {renderHeader()}
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
