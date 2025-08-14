using System;

namespace API.Common;

// made a common class for the register end point
public class Response<T> //this is a generic class. It is useful because it can be reused as in same class can be used as multiple data type.
{
    public bool IsSuccess { get; }
    public T Data { get; }
    public string? Error { get; }
    public string? Message { get; set; }
    public Response(bool isSuccess, T data, string? error, string? message)
    {
        IsSuccess = isSuccess;
        Data = data;
        Error = error;
        Message = message;
    }

    public static Response<T> Success(T data, string? message = "") => new(true, data, null, message);

    public static Response<T> Failure(string error) => new(false, default!, error, null);
}
