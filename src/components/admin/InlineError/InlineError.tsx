// Shows a server error exactly as returned, in a banner the screen reader
// announces immediately (role="alert" is assertive, unlike the toast region).
export function InlineError({ message }: { message: string }) {
  return (
    <p className="error-message" role="alert">
      {message}
    </p>
  )
}
