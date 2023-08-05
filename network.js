class network
{
	#ws;

	#connection_timeout = 10000;
	#connection_timer;
	#alive;

	#elements = {};

	on_connect() { console.log(this.name + '.on_connect') };
	on_disconnect() { console.log(this.name + '.on_disconnect') };

	connect()
	{
		const loc = window.location.hostname;

		this.#ws =
		    new WebSocket('ws://' + (loc ? loc : "localhost") + ':81');

		this.#ws.onopen = (evt) => {
			this.heartbeat();
			this.on_connect();
		};

		this.#ws.onclose = (evt) => {
			if (this.#alive == false)
				return;

			this.#alive = false;
			this.on_disconnect();
		};

		this.#ws.onerror = (evt) => { this.#ws.onclose(evt); };

		this.#ws.onmessage = (evt) => { this.on_message(evt.data) };
	}

	heartbeat()
	{
		clearInterval(this.#connection_timer);
		this.#alive = true;

		this.#connection_timer = setInterval(() => {
			console.log("timeout");
			if (this.#alive == true)
				this.on_disconnect();

			this.#alive = false;

			/** Remove event listeners from old websocket. */
			this.#ws.onopen = this.#ws.onclose = this.#ws.onerror =
			    this.#ws.onmessage = () => {};

			this.#ws.close();
			this.connect();
		}, this.#connection_timeout);
	}

	send(id, data)
	{
		console.log(JSON.stringify([ id, data ]));
		this.#ws.send(JSON.stringify([ id, data ]));
	};

	on_message(data)
	{
		this.heartbeat();

		console.log(JSON.stringify(data));
		data = JSON.parse(data);

		// Check if it contains single message
		if (typeof (data[0]) != "object") {
			this.#elements[data[0]].on_message(data[1]);
			return;
		}

		for (var i = 0; i < data.length; i++) {
			this.#elements[data[i][0]].on_message(data[i][1]);
		};
	};

	listen(id, object, on_message)
	{
		this.#elements[id] = object;
		object.on_message  = on_message;
	};

	constructor()
	{
		this.connect();
		this.heartbeat();
	}
}
