import { useState } from 'react'
const AddEmoji = ({ onEmojiSelect }) => {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <div className="emoji-wrapper">
            <button className="btn-emoji-inside" onClick={() => setShowPicker(!showPicker)}></button>
            {showPicker && (
                <EmojiPicker onEmojiClick={(emojiData) => {
                    onEmojiSelect(emojiData.emoji);
                    setShowPicker(false);
                }} />
            )}
        </div>
    )
}