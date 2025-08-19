import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private authService = inject(AuthService);
  private hubUrl = 'http://localhost:5000/hubs/chat';
  onlineUsers = signal<User[]>([]); // to show all the users
  currentOpenedChat = signal<User | null>({} as User); // for the user information of the chat opened


  private hubConnection?: HubConnection;

  startConnection(token:string, senderId?: string){
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(`${this.hubUrl}?senderId=${senderId || ''}`, {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();


    this.hubConnection
      .start()
      .then(() => {
         console.log('Connection Started');
      })
      .catch((error) => {
        console.log('Connection or login error', error);
      });
      
      this.hubConnection!.on('OnlineUsers', (user:User[]) => {
        console.log(user);
        this.onlineUsers.update(() =>
          user.filter(
            (u) => u.userName !== this.authService.currentLoggedUser?.userName)
          ); 
      });
    }

    disConnectConnection(){
      if(this.hubConnection?.state === HubConnectionState.Connected){
        this.hubConnection.stop().catch((error) => console.log(error));
      }
    }
}