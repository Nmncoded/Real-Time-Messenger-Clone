import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import {NextResponse} from 'next/server';


interface IParams {
  conversationId?: string
}

export const POST = async (request: Request,{params}: {params: IParams}) => {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params
  
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        messages: {
          include: {
            seen: true
          }
        },
        users: true
      }
    });

    if(!conversation){
      return new NextResponse("Invalid id", { status: 400 });

    }

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if(!lastMessage){
      return NextResponse.json(conversation);
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id
      },
      include: {
        sender: true,
        seen: true
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    })

    return NextResponse.json(updatedMessage);

  
  } catch (error) {
    // console.log("REGISTRATION_ERROR",error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};