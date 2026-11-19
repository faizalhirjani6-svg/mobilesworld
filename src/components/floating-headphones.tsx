export function FloatingHeadphones() {
  return (
    <div className="float-3d-wrap" aria-hidden="true">
      <div className="float-3d">
        <div className="float-headphone">
          <div className="fh-band" />
          <div className="fh-cup fh-cup-l">
            <div className="fh-cushion" />
            <div className="fh-dot" />
          </div>
          <div className="fh-cup fh-cup-r">
            <div className="fh-cushion" />
            <div className="fh-dot" />
          </div>
        </div>
        <div className="float-shadow" />
      </div>
    </div>
  );
}
