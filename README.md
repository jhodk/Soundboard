# Soundboard
![image](https://github.com/jhodk/Soundboard/assets/7433327/0d9053ac-8a48-4ca2-89d1-72edfe7e619d)

## Prerequisites
- Git https://git-scm.com/
- nvm (node version manager) to install Node. If you don't already have Node installed you can run these commands:
  - `nvm install --lts`
  - `nvm use --lts`

## Installation
- `git clone https://github.com/jhodk/Soundboard.git`
- `cd soundboard`
- `npm install`

Run the web interface with `npm run dev`

Run the server in a new terminal with `npm run server`

Place any sounds you want in the `public/sounds` directory.

Visit [localhost:5173](http://localhost:5173) to start using the soundboard.

## Virtual Audio Cable
If you want to play sounds through a microphone alongside your own voice then you will need https://vb-audio.com/Cable/.

Once installed you will be able to select `CABLE Input (VB-Audio Virtual Cable)` as a device.

You may also need to adjust the properties of your hardware microphone as follows: ![image](https://github.com/jhodk/Soundboard/assets/7433327/7e2b0cd9-5b74-4941-8da0-b556cff2acb7)


After this you can select the VB-Audio device as a microphone input in your chat program / OBS.

To increase the quality of the output, adjust the default format in advanced properties of the `CABLE Output` recording device to match your microphone:

![image](https://github.com/jhodk/Soundboard/assets/7433327/05069a00-81a0-4183-baad-3ce7c42af990)
