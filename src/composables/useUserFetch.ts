import type { Conversation, Message, ConversationListResponse, ConversationListParams } from '../types/chat';
import { useUserStore } from "@/stores/user";
import { AUTH_BASE_URL, CHAT_BASE_URL } from '~/settings/siteSettings';

const getauthToken = () => {
    const userStore = useUserStore()
    return userStore.user.auth_token
}

const onLogout = async () => {
    await useLogout()
    await navigateTo("/account/login", { replace: true });
}

type NewConversationResponse = {
    conversation: Conversation,
    new_prompt: Message,
    new_ai_res: Message,
}

type err = {
    detail: string
}

type UseAddConversationResult = {
    error?: err | null;
    data?: NewConversationResponse | null;
};


type UseAddMessageResult = {
    error?: err | null;
    data?: Message | null;
};

const getHeaders = async () => {

    let csrfToken = useCookie('csrftoken')
    if (!csrfToken.value) {
        await useFetch(AUTH_BASE_URL + 'account/csrf_cookie/', { credentials: 'include' })
    }
    csrfToken = useCookie('csrftoken')
    if (!csrfToken.value) {
        throw new Error('CSRF token is missing!');
    }
    return {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken.value,
        'Authorization': `Token ${getauthToken()}`
    }
}

export const useGetConversationList = async (params: ConversationListParams) => {
    const url = CHAT_BASE_URL + 'conversations/'
    const headers = await getHeaders();
    const { data, error } = await useFetch<ConversationListResponse>(url, { params: params, headers: headers, credentials: 'include' })
    if (error.value?.statusCode == 403) {
        console.log(error.value)
        await onLogout()
    }
    return data.value
}

export const useGetConvesationDetail = async (conversationId: string) => {
    const url = CHAT_BASE_URL + 'conversations/' + conversationId + '/'
    const headers = await getHeaders();
    const { data, error } = await useFetch<Conversation>(url, { headers: headers, credentials: 'include' })
    if (error.value?.statusCode == 403) {
        console.log(error.value)
        await onLogout()
    }
    return data.value
}

export const useAddConversation = async (prompt: string): Promise<UseAddConversationResult> => {
    const url = CHAT_BASE_URL + 'conversations/create/'
    const body = {
        "prompt": prompt,
    };
    const headers = await getHeaders();
    const { data, error } = await useFetch<NewConversationResponse>(url,
        { method: 'POST', headers: headers, body: body, credentials: 'include' })
    if (error.value) {
        const ret = { error: error.value.data, data: null };
        if (error.value.statusCode == 403) {
            console.log(error.value)
            await onLogout()
            return ret
        }
        return ret
    }
    return { data: data.value };
}


export const useAddMessage = async (conversationId: string, prompt: string): Promise<UseAddMessageResult> => {
    const url = CHAT_BASE_URL + 'conversations/' + conversationId + '/messages/create/'
    const body = {
        "message": prompt,
    };
    const headers = await getHeaders();
    const { data, error } = await useFetch<Message>(url, { method: 'POST', headers: headers, body: body, credentials: 'include' })
    if (error.value) {
        const ret = { error: error.value.data, data: null };
        if (error.value?.statusCode == 403) {
            console.log(error.value)
            await onLogout()
            return ret;
        }
        return ret;
    }
    return { data: data.value };
}