import type { PropsWithChildren } from "react"
import { useAuth } from "react-oidc-context"



export default function Private(props: PropsWithChildren) {
 
  const auth = useAuth()

  if (!auth.isAuthenticated){
    auth.signinRedirect();
    return null
    

  }

    return  props.children
}