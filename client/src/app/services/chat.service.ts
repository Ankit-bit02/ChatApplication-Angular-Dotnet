import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private authService = inject(AuthService);
  private hubUrl = 'http://localhost:5000/hubs/chat';
  onlineUsers = signal<User[]>([]); // to show all the users
  currentOpenedChat = signal<User | null>(null); // for the user information of the chat opened
  chatMessages = signal<Message[]>([]);
  isLoading = signal<boolean>(true);
  autoScrollEnabled = signal<boolean>(true);

  private hubConnection?: HubConnection;

  startConnection(token:string, senderId?: string){  // this builds a hub connection with jwt token or sender id(optional)
    if(this.hubConnection?.state === HubConnectionState.Connected) return;

    if(this.hubConnection){
      this.hubConnection.off('ReceiveNewMessage');
      this.hubConnection.off('ReceiveMessageList');
      this.hubConnection.off('OnlineUsers');
      this.hubConnection.off('NotifyTypingToUser');
      this.hubConnection.off('Notify');
    }

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

      this.hubConnection!.on('Notify', (user:User) => {    // browser active user notification
        Notification.requestPermission().then((result) => {
          if(result == 'granted') {
            new Notification('Active Now 🟢', {
              body: user.fullName + ' is online now',
              icon: user.profileIMage,
            });
          }
        });
      });

      this.hubConnection!.on('OnlineUsers', (user:User[]) => {
        console.log(user);
        this.onlineUsers.update(() =>
          user.filter(
            (u) => u.userName !== this.authService.currentLoggedUser?.userName)
          ); 
      });

      this.hubConnection!.on('NotifyTypingToUser', (senderUserName) => {
        this.onlineUsers.update((users) => 
          users.map((user) => {
            if(user.userName === senderUserName) {
              user.isTyping = true;
            }
            return user;
          })
        );

        setTimeout(() => {
          this.onlineUsers.update((users) => 
          users.map((user) => {
            if(user.userName === senderUserName){
              user.isTyping = false;
            }
            return user;
          })
        );
        }, 2000)
      });

      this,this.hubConnection!.on("ReceiveMessageList",(message) => {
        this.isLoading.update(() => true);
        this.chatMessages.update(messages=>[...message,...messages])
        this.isLoading.update(() => false)
      });

      this.hubConnection!.on('ReceiveNewMessage', (message: Message) => {
        let audio = new Audio('assets/notification.wav');
        audio.play();
        document.title = '(1) New Message';
        this.chatMessages.update((messages) => [...messages, message]);
      });
    }

    disConnectConnection(){  // disconnec the signalr connection safely
      if(this.hubConnection?.state === HubConnectionState.Connected){  // if the connection is connected
        this.hubConnection.stop().catch((error) => console.log(error)); // then safely stop the connection
      }
    }

    sendMessage(message: string){  // this sends the message to the backend and updated chat
      this.chatMessages.update((messages) => [
        ...messages,
        {
          content: message,
          senderId: this.authService.currentLoggedUser!.id,
          receiverId: this.currentOpenedChat()?.id!,
          createdDate: new Date().toString(),
          isRead: false,
          id: 0,
        },
      ]);

      this.hubConnection?.invoke('SendMessage', {
        receiverId: this.currentOpenedChat()?.id,
        content: message,
      })
      .then((id) => {
        console.log('message sent to', id);
      })
      .catch((error) => {
        console.log(error);
      });
    }
    
    status(userName: string): string {
      const currentChatUser = this.currentOpenedChat();
      if(!currentChatUser){
        return 'offline';
      }

      const onlineUser = this.onlineUsers().find(
        (user) => user.userName === userName
      );

      return onlineUser?.isTyping ? 'Typing...' : this.isUserOnline();

  }

  isUserOnline(): string{ // checks if the currently opened chat is online or not
    let onlineUser = this.onlineUsers().find(
      (user) => user.userName === this.currentOpenedChat()?.userName
    );

    return onlineUser?.isOnline ? 'online' : this.currentOpenedChat()!.userName;
  }

  loadMessages(pageNumber:number){  // this methods load the chat messages
    this.isLoading.update(() => true);
    this.hubConnection?.invoke("LoadMessages", this.currentOpenedChat()?.id, pageNumber)
    .then()
    .catch()
    .finally(() => {
      this.isLoading.update(() => false);
    });
  }
      
  notifyTyping(){
    this.hubConnection!.invoke('NotifyTyping', this.currentOpenedChat()?.userName)
    .then((x) => {console.log("notify for",x)}).catch((error) =>{
      console.log(error);
    })
  }
}