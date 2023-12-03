import { Avatar, Box, Typography } from "@mui/material";
import { CaUser } from "model";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { uploadImageAndSaveUrl } from "../firebase";
import { UserMFABadge } from "../utils/UserMFABadge";
import { UserNumberBadge } from "../utils/UserNumberBadge";
import { UserPostsNumberBadge } from "../utils/UserPostsNumberBadge";

interface ProfileInforProps {
    userProfile: CaUser | null;
}

interface AvatarInputProps {
    value: string;
    userId: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AvatarInput = ({
    value,
    onChange,
    userId,
}: AvatarInputProps) => {
    const [avatarImage, setAvatarImage] = useState<string>("");

    const handleAvatarClick = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const imageUrl = await uploadImageAndSaveUrl(userId, file);
                setAvatarImage(imageUrl);
                onChange({
                    target: {
                        name: "photoUrl",
                        value: imageUrl,
                    },
                } as React.ChangeEvent<HTMLInputElement>);
            }
        };
        input.click();
    };

    return (
        <>
            <input type="hidden" name={"photoUrl"} value={value} />
            <Avatar
                sx={{ width: 100, height: 100 }}
                alt="user profile image"
                src={avatarImage || value}
                onClick={handleAvatarClick}
            />
        </>
    );
};

export const ProfileInfos = ({ userProfile }: ProfileInforProps) => {
    const [avatarImage, setAvatarImage] = useState<string>("");
    const { userId } = useParams<{ userId: string }>();
    return (
        <Box
            sx={{
                mt: 16,
                width: 250,
                boxShadow: 1,
                borderRadius: "borderRadius",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Box
            >
                <AvatarInput
                    value={userProfile?.photoUrl ?? avatarImage}
                    userId={userId ?? ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAvatarImage(e.target.value);
                    }}
                />
            </Box>
            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="h6" component="h2" color="white">
                    {userProfile?.userName}
                </Typography>
                <Typography variant="body2" color="white">
                    {userProfile?.bio}
                </Typography>
            </Box>
            <Box
                sx={{
                    py:2,
                    px: 2,
                    mt: 2,
                    display: "flex",
                    width:"100%",
                    justifyContent: "space-between",
                }}
            >
                <UserNumberBadge value={userProfile?.userNumber ?? 0} />
                <UserPostsNumberBadge value={userProfile?.userNumber ?? 0} />
                <UserMFABadge value={userProfile?.mfaEnabled ?? false} />
                {/* Add your icons here */}
            </Box>
        </Box>
    );
};
