export interface ApiResponse<T>{   // exported from the Response.cs class inside Common folder of API
    isSuccess:boolean;
    data:T;
    error:string;
    message:string;
}