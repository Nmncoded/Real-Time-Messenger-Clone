import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import {NextResponse} from 'next/server';


interface IParams {
  conversationId?: string
}

export const DELETE = async (request: Request,{params}: {params: IParams}) => {
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
        users: true
      }
    });

    if(!conversation){
      return new NextResponse("Invalid id", { status: 400 });

    }

    const deletedConversation = await prisma.conversation.delete({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      },
    })

    return NextResponse.json(deletedConversation);

  
  } catch (error) {
    console.log("CONVERSATION_ERROR_DELETE",error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};