import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HttpHelper{

    constructor(private http: HttpClient){
                    
                }

   
    
    private sendPost<T>(url, data) : Promise<T> {
        return new Promise((resolve, reject) =>{
            console.log("url", url)

            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': environment.apiSecretKey
            })
            try {
                this.http.post(url, data, { headers: headers}).toPromise().then(response =>{
                    resolve(response as T)
                }).catch(err=>{
                    reject()
                });    
            } catch (error) {
                console.error(error)
                reject("Error send post")
            }
            
        })
    }

    private sendGet<T>(url) : Promise<T> {
        return new Promise((resolve, reject) =>{
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': environment.apiSecretKey
            })
            try {
                this.http.get(url, { headers: headers}).toPromise().then(response =>{
                    resolve(response as T)
                }).catch(err=>{
                    reject(err)
                });    
            } catch (error) {
               console.error(error)
               reject("Error get") 
            }
            
        })
    }

    public get<T>(action:string) : Promise<T>{
        let url = `${environment.apiUrl}${action}`;
        return new Promise(async (resolve, reject) =>{
            this.sendGet<T>(url).then(r=>{
                resolve(r);
            }).catch(err=>{
                reject(err);
            })
        })
    }

    public post<T>(action:string, data: any) : Promise<T>{
        let url = `${environment.apiUrl}${action}`;
        return new Promise(async (resolve, reject) =>{
            this.sendPost<T>(url, data).then(r=>{
                resolve(r);
            }).catch(err=>{
                reject();
            })
        })
    }

   

}