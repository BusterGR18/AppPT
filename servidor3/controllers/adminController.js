const SystemLog = require('../models/SystemLog');
const User = require('../models/user');
const Telemetry = require('../models/Telemetry');

// Fetch System Logs
exports.getSystemLogs = async (req, res) => {
  try {
    const { severity, module, page = 1, limit = 100 } = req.query;

    const query = {};
    if (severity) query.severity = severity;
    if (module) query.module = module;

    const logs = await SystemLog.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ timestamp: -1 });

    const totalLogs = await SystemLog.countDocuments(query);

    res.status(200).json({ logs, totalLogs });
  } catch (error) {
    console.error('Error fetching system logs:', error);
    res.status(500).json({ error: 'Error fetching system logs' });
  }
};

// Fetch User Metrics
exports.getUserMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true }); // Example of active flag

    res.status(200).json({ totalUsers, activeUsers });
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    res.status(500).json({ error: 'Error fetching user metrics' });
  }
};

// Fetch Telemetry Summary


exports.getTelemetrySummary = async (req, res) => {
    try {
        const { boardId } = req.params;

        const matchStage = boardId ? { $match: { boardid: boardId } } : { $match: {} };

        const summary = await Telemetry.aggregate([
            matchStage,
            { $unwind: "$events" },
            {
                $group: {
                    _id: "$events.type",
                    count: { $sum: 1 },
                    firstEvent: { $min: "$events.when" },
                    lastEvent: { $max: "$events.when" },
                    avgValue: {
                        $avg: {
                            $cond: [
                                { $eq: ["$events.type", "speed"] },
                                {
                                    $convert: {
                                        input: {
                                            $arrayElemAt: [
                                                {
                                                    $split: [
                                                        { $trim: { input: "$events.value" } },
                                                        " "
                                                    ]
                                                },
                                                1
                                            ]
                                        },
                                        to: "double",
                                        onError: null,
                                        onNull: null
                                    }
                                },
                                null
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    type: "$_id",
                    count: 1,
                    firstEvent: 1,
                    lastEvent: 1,
                    avgValue: 1
                }
            }
        ]);

        res.status(200).json(summary);
    } catch (error) {
        console.error("Error fetching telemetry summary:", error);
        res.status(500).json({ error: "Error fetching telemetry summary" });
    }
};

