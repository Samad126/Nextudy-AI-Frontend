function Countdown({ countdown }: { countdown: number }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <span
        key={countdown}
        className="animate-ping-once text-7xl font-bold text-primary tabular-nums"
      >
        {countdown === 0 ? "Go!" : countdown}
      </span>
    </div>
  )
}

export default Countdown
