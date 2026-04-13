import { useMemo, useState } from 'react'

const devices = [
  {
    id: 1,
    name: 'PPM4-A1',
    serial: 'AT-PPM4-001',
    type: 'Pressure Monitor',
    location: 'Isolation Room A',
    status: 'online',
    lastSeen: '2 minutes ago',
    firmware: 'v2.4.1',
    readings: {
      pressure: '-0.03 inWC',
      temperature: '21.8°C',
      humidity: '46%',
      airflow: '318 CFM',
    },
    alerts: 0,
    trend: [72, 76, 78, 81, 79, 84, 88],
  },
  {
    id: 2,
    name: 'RPM-B4',
    serial: 'AT-RPM-014',
    type: 'Room Pressure Monitor',
    location: 'Surgical Suite 2',
    status: 'warning',
    lastSeen: '1 minute ago',
    firmware: 'v1.9.3',
    readings: {
      pressure: '-0.01 inWC',
      temperature: '23.1°C',
      humidity: '54%',
      airflow: '280 CFM',
    },
    alerts: 2,
    trend: [65, 67, 70, 68, 64, 61, 58],
  },
  {
    id: 3,
    name: 'EDGE-C9',
    serial: 'AT-EDGE-109',
    type: 'Sensor Hub',
    location: 'Lab Corridor',
    status: 'critical',
    lastSeen: 'Just now',
    firmware: 'v3.0.0',
    readings: {
      pressure: '+0.01 inWC',
      temperature: '28.2°C',
      humidity: '61%',
      airflow: '198 CFM',
    },
    alerts: 3,
    trend: [48, 44, 42, 37, 31, 28, 24],
  },
  {
    id: 4,
    name: 'PPM4-D7',
    serial: 'AT-PPM4-221',
    type: 'Pressure Monitor',
    location: 'Patient Room 6',
    status: 'offline',
    lastSeen: '18 minutes ago',
    firmware: 'v2.3.7',
    readings: {
      pressure: '—',
      temperature: '—',
      humidity: '—',
      airflow: '—',
    },
    alerts: 1,
    trend: [82, 82, 80, 79, 77, 70, 55],
  },
]

const alerts = [
  {
    id: 1,
    severity: 'critical',
    device: 'EDGE-C9',
    metric: 'Airflow',
    message: 'Airflow dropped below critical threshold.',
    time: '1 min ago',
  },
  {
    id: 2,
    severity: 'warning',
    device: 'RPM-B4',
    metric: 'Pressure',
    message: 'Pressure approaching threshold limit.',
    time: '4 min ago',
  },
  {
    id: 3,
    severity: 'offline',
    device: 'PPM4-D7',
    metric: 'Connectivity',
    message: 'Device has not reported within expected interval.',
    time: '18 min ago',
  },
]

function statusClass(status) {
  switch (status) {
    case 'online':
      return 'pill sky'
    case 'warning':
      return 'pill amber'
    case 'critical':
      return 'pill rose'
    case 'offline':
      return 'pill slate'
    default:
      return 'pill slate'
  }
}

function StatCard({ label, value, subtext }) {
  return (
    <div className="panel stat-card">
      <div className="eyebrow muted">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="muted small">{subtext}</div>
    </div>
  )
}

function TrendBars({ values }) {
  const max = Math.max(...values)

  return (
    <div className="trend-box">
      {values.map((value, index) => {
        const height = `${Math.max(18, (value / max) * 100)}%`
        return <div key={index} className="trend-bar" style={{ height }} />
      })}
    </div>
  )
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <div className="muted small metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  )
}

export default function App() {
  const [selectedId, setSelectedId] = useState(devices[0].id)
  const [filter, setFilter] = useState('all')

  const selectedDevice = useMemo(
    () => devices.find((device) => device.id === selectedId) || devices[0],
    [selectedId],
  )

  const filteredDevices = useMemo(() => {
    if (filter === 'all') return devices
    return devices.filter((device) => device.status === filter)
  }, [filter])

  const totalDevices = devices.length
  const healthyDevices = devices.filter((device) => device.status === 'online').length
  const activeAlerts = devices.reduce((sum, device) => sum + device.alerts, 0)
  const offlineDevices = devices.filter((device) => device.status === 'offline').length

  return (
    <div className="app-shell">
      <div className="background-glow" />

      <header className="topbar">
        <div className="container topbar-inner">
          <div>
            <div className="eyebrow accent">Python Project 01</div>
            <h1>IoT Monitoring Dashboard</h1>
            <p className="hero-copy">
              A premium monitoring interface for connected devices, designed around
              live system health, telemetry visibility, and threshold-based alerting.
            </p>
          </div>

          <div className="tag-row">
            {['Python', 'Django', 'Bootstrap', 'SQLite', 'IoT'].map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="container main-grid">
        <section className="stats-grid">
          <StatCard label="Total Devices" value={totalDevices} subtext="Connected monitoring units" />
          <StatCard label="Healthy Devices" value={healthyDevices} subtext="Reporting normally" />
          <StatCard label="Active Alerts" value={activeAlerts} subtext="Warnings, critical, and offline" />
          <StatCard label="Offline Devices" value={offlineDevices} subtext="Require attention" />
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="section-heading">
              <div className="eyebrow accent">Overview</div>
              <h2>Device Fleet</h2>
              <p className="muted section-copy">
                Browse active monitoring units, compare health states, and inspect
                current telemetry in a polished operations view.
              </p>
            </div>

            <div className="filter-row">
              {[
                ['all', 'All'],
                ['online', 'Online'],
                ['warning', 'Warning'],
                ['critical', 'Critical'],
                ['offline', 'Offline'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={filter === key ? 'filter active' : 'filter'}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="device-list">
              {filteredDevices.map((device) => (
                <button
                  key={device.id}
                  className={selectedId === device.id ? 'device-card active' : 'device-card'}
                  onClick={() => setSelectedId(device.id)}
                >
                  <div className="device-card-header">
                    <div>
                      <div className="device-title-row">
                        <h3>{device.name}</h3>
                        <span className={statusClass(device.status)}>{device.status}</span>
                      </div>
                      <p className="muted small">
                        {device.type} • {device.location}
                      </p>
                      <p className="muted small">
                        Serial: {device.serial} • Last seen: {device.lastSeen}
                      </p>
                    </div>

                    <div className="metrics-grid compact">
                      <MetricCard label="Pressure" value={device.readings.pressure} />
                      <MetricCard label="Temp" value={device.readings.temperature} />
                      <MetricCard label="Humidity" value={device.readings.humidity} />
                      <MetricCard label="Alerts" value={device.alerts} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="detail-column">
            <div className="panel">
              <div className="section-heading">
                <div className="eyebrow accent">Device Detail</div>
                <h2>{selectedDevice.name}</h2>
                <p className="muted section-copy">
                  {selectedDevice.type} in {selectedDevice.location}
                </p>
              </div>

              <div className="metrics-grid two-up">
                <MetricCard label="Serial Number" value={selectedDevice.serial} />
                <MetricCard label="Firmware" value={selectedDevice.firmware} />
                <MetricCard label="Current Status" value={selectedDevice.status} />
                <MetricCard label="Last Seen" value={selectedDevice.lastSeen} />
              </div>

              <div className="trend-panel">
                <div className="trend-header">
                  <div>
                    <div className="muted small">Recent Health Trend</div>
                    <div className="trend-title">Last 7 intervals</div>
                  </div>
                  <span className={statusClass(selectedDevice.status)}>{selectedDevice.status}</span>
                </div>
                <TrendBars values={selectedDevice.trend} />
              </div>

              <div className="metrics-grid two-up">
                {Object.entries(selectedDevice.readings).map(([label, value]) => (
                  <MetricCard key={label} label={label} value={value} />
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="section-heading">
                <div className="eyebrow accent">Alerts</div>
                <h2>Recent System Events</h2>
                <p className="muted section-copy">
                  Threshold notifications and device connectivity issues surfaced in a
                  clean, action-oriented feed.
                </p>
              </div>

              <div className="alert-list">
                {alerts.map((alert) => (
                  <div className="alert-card" key={alert.id}>
                    <div className="alert-meta">
                      <span className={statusClass(alert.severity)}>{alert.severity}</span>
                      <span className="muted small">{alert.time}</span>
                    </div>
                    <h3>
                      {alert.device} • {alert.metric}
                    </h3>
                    <p className="muted section-copy">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
