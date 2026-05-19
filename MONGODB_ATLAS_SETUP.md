# MongoDB Atlas Setup Guide for BEE1 Application

## Overview
Your application is already configured to work with MongoDB Atlas using Mongoose. Follow these steps to set up your MongoDB Atlas cluster and connect your application.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **Sign Up** and create a free account
3. Verify your email address
4. Complete the account setup

## Step 2: Create a Cluster

1. After logging in, click **Create a Deployment**
2. Choose **M0 Free** (free tier with 512MB storage)
3. Select your preferred cloud provider (AWS, GCP, or Azure) and region
4. Click **Create Deployment**
5. Wait for the cluster to be created (usually takes 1-3 minutes)

## Step 3: Create Database User

1. In the left sidebar, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** as the authentication method
4. Enter a username (e.g., `bee1_user`)
5. Click **Auto-generated Secure Password** to create a strong password
6. **Save this password securely** - you'll need it for the connection string
7. Click **Add User**

## Step 4: Configure Network Access

1. In the left sidebar, go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (for development) or add your specific IP
4. Click **Confirm**

**Note:** For production, restrict to specific IP addresses for security.

## Step 5: Get Your Connection String

1. Go to **Database** in the left sidebar
2. Click **Connect** next to your cluster
3. Choose **Drivers** option
4. Select **Node.js** as the driver and version **4.x or later**
5. Copy the connection string shown

### Connection String Format
```
mongodb+srv://username:password@cluster0.mongodb.net/bee1?retryWrites=true&w=majority
```

Replace:
- `username`: Your database user (e.g., bee1_user)
- `password`: Your database user password (URL-encode if contains special characters)
- `cluster0`: Your cluster name
- `bee1`: Your database name

### Special Characters in Password
If your password contains special characters like `@`, `#`, `$`, etc., URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `:` → `%3A`

Use an online URL encoder or encode in your terminal.

## Step 6: Update Your Environment Variables

1. If you don't have a `.env` file, create one:
```bash
cp .env.example .env
```

2. Open `.env` and update the `MONGODB_URI` with your connection string:
```
MONGODB_URI=mongodb+srv://bee1_user:YOUR_PASSWORD@cluster0.mongodb.net/bee1?retryWrites=true&w=majority
```

3. Save the file

## Step 7: Verify Connection

1. Make sure MongoDB Atlas user and network access are configured
2. Start your application:
```bash
npm start
```

3. Check the console for:
```
MongoDB Connected: ac-xxxxx.mongodb.net
Server running in development mode on port 5000
```

## Step 8: Create Initial Collections

Your application automatically creates collections when you first insert data. The following collections will be created:
- `users`
- `restaurants`
- `dishes`
- `orders`
- `quickorders`

## Useful MongoDB Atlas Features

### View Your Data
1. Click **Collections** in your cluster view
2. Browse your databases and collections
3. View, insert, update, or delete documents

### Monitor Your Cluster
1. Click **Metrics** to see cluster performance
2. Check connection count, query performance, and storage usage

### Backup & Restore
1. Go to **Backup** for automated backups
2. Create on-demand snapshots
3. Restore from snapshots if needed

## Troubleshooting

### Connection Issues
- ✅ Check that IP address is whitelisted in Network Access
- ✅ Verify username and password are correct
- ✅ Ensure special characters in password are URL-encoded
- ✅ Check that cluster is not paused
- ✅ Verify network connectivity to Atlas

### Authentication Failed
- ✅ Double-check username and password in connection string
- ✅ Ensure user has database access permissions
- ✅ Reset user password if needed

### Slow Connections
- ✅ Use a server closer to your data center
- ✅ Check network connectivity
- ✅ Monitor cluster metrics for CPU/Memory usage
- ✅ Upgrade cluster if needed

## Environment Variable Security

**Never commit your `.env` file to version control!**

Ensure `.gitignore` contains:
```
.env
.env.local
.env.*.local
```

Your `.env.example` file should contain only placeholders, never actual credentials.

## Next Steps

1. Set up MongoDB Atlas cluster
2. Create database user
3. Configure network access
4. Update `.env` file with connection string
5. Start your application
6. Monitor your cluster in MongoDB Atlas dashboard

For more help, visit [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
