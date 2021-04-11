export function constractCreateQueryStringBasedOnParams(
  tableName: string,
  columnObject: { [columnKey: string]: any }
): { queryString: string; valuesArray: any } {
  let columnNames: Array<string> = [];
  let columnValues: Array<any> = [];
  Object.keys(columnObject).forEach((columnKey: string) => {
    let tempColumnValue: any = columnObject[columnKey];
    if (tempColumnValue != null) {
      columnNames.push(columnKey);
      columnValues.push(tempColumnValue);
    }
  });
  const createRecordQueryString = `INSERT INTO ${tableName} (${columnNames.join(
    ', '
  )}) VALUES (${columnValues.map(
    (elem: any) => `$${columnValues.indexOf(elem) + 1}`
  )})`;
  return { queryString: createRecordQueryString, valuesArray: columnValues };
}

export function constractUpdateQueryStringBasedOnParams(
  tableName: string,
  uuid: string,
  columnObject: { [columnKey: string]: any }
): { queryString: string; valuesArray: any } {
  let columnValues: Array<any> = [];
  let updateRecordQueryString = `UPDATE ${tableName} SET `;
  let counter = 1;
  Object.keys(columnObject).forEach((columnKey: string) => {
    let tempColumnValue: any = columnObject[columnKey];
    if (tempColumnValue != null) {
      updateRecordQueryString += `${columnKey} = $${counter}, `;
      columnValues.push(tempColumnValue);
      counter += 1;
    }
  });
  updateRecordQueryString = updateRecordQueryString.substring(
    0,
    updateRecordQueryString.length - 2
  );
  updateRecordQueryString += `WHERE uuid = $${counter}`;
  columnValues.push(uuid);
  return { queryString: updateRecordQueryString, valuesArray: columnValues };
}
