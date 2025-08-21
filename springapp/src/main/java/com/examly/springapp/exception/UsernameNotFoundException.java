
// package com.examly.springapp.exception;import org.springframework.http.HttpStatus;import org.springframework.web.bind.annotation.ResponseStatus;
// /** * This is a custom exception that will be thrown when a user is not found. * The @ResponseStatus annotation tells Spring to return a 404 NOT FOUND error * to the client when this exception is thrown from a controller. */
// @ResponseStatus(HttpStatus.NOT_FOUND)public class UsernameNotFoundException extends RuntimeException {    
//     public UsernameNotFoundException(String message) {        
//         super(message);    
//     }    
//     public UsernameNotFoundException(String message, Throwable cause) {        
//         super(message, cause);    
//     }
// } 