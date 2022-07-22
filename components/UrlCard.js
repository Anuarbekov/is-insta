export default function UrlCard({ urlToFriend, isUrlExist }) {
  return (
    <div className="url-card">
      <h5>{urlToFriend}</h5>
      {isUrlExist ? <i className="fa-solid fa-copy"></i> : null}
    </div>
  );
}
