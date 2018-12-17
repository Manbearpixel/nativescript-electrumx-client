export function makeRequest(method: string, params: object, id?: number): string {
  if (typeof id === 'undefined') id = 0;
  
  return JSON.stringify({
    jsonrpc : "2.0",
    method : method,
    params : params,
    id : id,
  });
}

export function createPromiseResult(resolve, reject) {
  return (err: ErrorEvent, result: any) => {
    if (err) reject(err);
    else resolve(result);
  };
}
