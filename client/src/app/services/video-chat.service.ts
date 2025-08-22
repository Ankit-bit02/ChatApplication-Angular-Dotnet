import { inject, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoChatService {
  private hubUrl = "http://localhost:5000/hubs/video";
  public hubConnection!:HubConnection;
  private authService = inject(AuthService);

  public offerReceive = new BehaviorSubject<{senderId:string, offer:RTCSessionDescriptionInit} | null>(null);
  public answerReceive = new BehaviorSubject<{senderId:string, answer:RTCSessionDescription} | null>(null);
  public iceCandidateReceive = new BehaviorSubject<{senderId:string, candidate:RTCSessionDescription} | null>(null);

  startConnection(){
    this.hubConnection =new HubConnectionBuilder()
    .withUrl(this.hubUrl, {
      accessTokenFactory:() => this.authService.getAccessToken!
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start().catch((err) => console.error("SignalRConnectionError", err));

    this.hubConnection.on("ReceiveOffer", (senderId, offer) => {
      this.offerReceive.next({senderId, offer:JSON.parse(offer)});
    })

    this.hubConnection.on("ReceiveAnswer", (senderId, answer) => {
      this.answerReceive.next({senderId, answer:JSON.parse(answer)});
    })

    this.hubConnection.on("ReceiveIceCandidate", (senderId, candidate) => {
      this.iceCandidateReceive.next({senderId, candidate:JSON.parse(candidate)});
    })
  }

  sendOffer(receiverId:string, offer:RTCSessionDescription){
    this.hubConnection.invoke("SendOffer", receiverId, JSON.stringify(offer));
  }

  sendAnswer(receiverId:string, answer:RTCSessionDescriptionInit){
    this.hubConnection.invoke("SendAnswer", receiverId,JSON.stringify(answer));
  }

  sendIceCandidate(receiverId:string, candidate:RTCIceCandidate){
    this.hubConnection.invoke("SendIceCandidate", receiverId,JSON.stringify(candidate));
  }

  sendEndCall(receiverId:string){
    this.hubConnection.invoke("EndCall", receiverId);
  }
}
