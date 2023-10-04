import { firebaseAuth as auth, firebaseGoogleProvider as provider, firebaseStorage } from "../../config/firebase"
import { ref, uploadBytes, getDownloadURL } from "@firebase/storage";
import { signInWithPopup, signOut, setPersistence, browserLocalPersistence, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getPresets } from "./presets.action";
import { setCodeAll } from "./code.action";
import { setCreateNew } from "./modal.action";
import { toast } from 'sonner'

export const authStateAction = () => {

    return async dispatch => {
        onAuthStateChanged(auth, (user) => {
            dispatch(getPresets(user?.uid))
        })
    }
}

export const signInGoogle = () => {

    return async dispatch => {
        dispatch({
            type: "SET_AUTH_LOADER",
            authLoader: true
        });
        setPersistence(auth, browserLocalPersistence)
            .then(async () => {

                return signInWithPopup(auth, provider)
                    .then((result) => {
                        const user = result.user;

                        dispatch({
                            type: "SIGN_IN",
                            userId: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            avatar: user.photoURL
                        })
                        toast.message('Auth', {
                            description: `User signed in: ${user.displayName}`,
                        })
                    }).catch((e) => {
                        console.log("error signing in with google: ", e)
                        toast.error('Error signing in')
                    }).finally(() => {
                        dispatch({
                            type: "SET_AUTH_LOADER",
                            authLoader: false
                        });
                    });
            }).catch((error) => {
                console.log("error setting persistance: " + error);
                toast.error('Error signing in')
            }).finally(() => {
                dispatch({
                    type: "SET_AUTH_LOADER",
                    authLoader: false
                });
            });
    }
}

export const signOutUser = () => {

    return async dispatch => {
        dispatch({
            type: "SET_AUTH_LOADER",
            authLoader: true
        });

        signOut(auth).then(() => {
            dispatch(setCodeAll("", "", ""))
            dispatch(setCodeAll("", "", ""))
            dispatch(setCreateNew(true))

            dispatch({
                type: "SIGN_OUT",
            })
            toast.message('Auth', {
                description: `User signed out`,
            })
        }).catch((e) => {
            console.log("error signing out: ", e)
            toast.error('Error signing out')
        }).finally(() => {
            dispatch({
                type: "SET_AUTH_LOADER",
                authLoader: false
            });
        });
    }
}

export const updateDisplayName = (displayName, newDisplayName) => {

    return async dispatch => {
        dispatch({
            type: "SET_DISPLAY_NAME_LOADER",
            updateDisplayNameLoader: true
        });

        updateProfile(auth.currentUser, {
            displayName: newDisplayName
        }).then(() => {
            dispatch({
                type: "UPDATE_DISPLAY_NAME",
                displayName: newDisplayName
            })
            toast.message('Profile', {
                description: `User renamed: ${displayName} ➔ ${newDisplayName}`,
            })
        }).catch((e) => {
            console.log("error updating username: ", e)
            toast.error('Error updating username')
        }).finally(() => {
            dispatch({
                type: "SET_DISPLAY_NAME_LOADER",
                updateDisplayNameLoader: false
            });
        })

    }
}

export const updateAvatar = (userId, file) => {
    return async dispatch => {
        dispatch({
            type: "SET_AVATAR_LOADER",
            updateAvatarLoader: true
        });

        try {
            const storageRef = ref(firebaseStorage, `avatars/${userId}`);

            uploadBytes(storageRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    updateProfile(auth.currentUser, {
                        photoURL: url
                    }).then(() => {
                        dispatch({
                            type: "UPDATE_AVATAR",
                            avatar: url
                        })
                        toast.message('Profile', {
                            description: `User avatar updated`,
                        })
                        dispatch({
                            type: "SET_AVATAR_LOADER",
                            updateAvatarLoader: false
                        });
                    }).catch((e) => {
                        console.log("error updating avatar: ", e)
                        toast.error("Error updating avatar")
                    })
                }).catch((e) => {
                    console.log("error retrieving avatar url: ", e)
                    toast.error("Error retrieving avatar url")
                });
            });
        } catch (e) {
            console.log("error uploading avatar: ", e)
            toast.error("Error uploading avatar")
        }
    }
}