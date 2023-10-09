# SpotSurfing

SpotSurfing is an AirBnB clone where users can add spots to their profile, book other spots, and post ratings and reviews.

**Live Site:** [SpotSurfing](https://airbnb-clone-agql.onrender.com)

**Created By:** [Aurora Ignacio](https://github.com/bellaignacio)

**Technologies Used:** [JavaScript](https://devdocs.io/javascript/) | [PostgreSQL](https://www.postgresql.org/docs/) | [Express](https://expressjs.com/) | [Sequelize](https://sequelize.org/) | [React](https://react.dev/) | [Redux](https://redux.js.org/)

## Design Documentation

* [Backend API Documentation](https://github.com/bellaignacio/airbnb-clone-express/wiki/Backend-Routes)
* [Database Schema](https://github.com/bellaignacio/airbnb-clone-express/wiki/Database-Schema)

## How to build & run the project locally:

 1. Clone this GitHub repository [bellaignacio/splitwise-clone-flask](https://github.com/bellaignacio/splitwise-clone-flask) onto your local machine.
 2. Set up your own AWS S3 Bucket.
 3. Create a `.env` file inside the root directory with the proper settings for your development environment. See the `example.env` file.
 4. Inside the root directory, run the following command to install Python dependencies
	```
	pipenv install -r requirements.txt
	```
 5. Inside the react-app directory, run the following command to install JavaScript dependencies
	```
	 npm install
	```
 6. Inside the root directory, run the following command to create and seed the database, and start up the backend server
	```
	pipenv shell && flask db init && flask db migrate && flask db upgrade && flask seed all && flask run -p 3000
	```
7. Inside the react-app directory, run the following command to start up the frontend server
	```
	npm start
	```

## Site In Action

### Sign Up Page
![Sign Up Page](/react-app/public/signup.png)

### Login Page
![Login Page](/react-app/public/login.png)

### Dashboard Page
![Dashboard Page](/react-app/public/dashboard.png)

### Account Settings Page
![Account Settings Page](/react-app/public/settings.png)

### Friend Page
![Friend Page](/react-app/public/friend.png)

## Implementation Details

In order to maintain the integrity of financial settlements, "removing" a friend is not a deletion, but rather a deactivation of the friendship. As a result, removing a friend will not get rid of unsettled bills and payment history. Adding the friend back is a simple Boolean switch, and IOU's are not mistakenly dismissed.

```python
def create_friendship():
    """
    Creates a new friendship
    """
    form = FriendForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        friend = User.query.filter(User.email == form.data['email']).first()
        existing_friendship = Friendship.query.filter(Friendship.user_id == current_user.id, Friendship.friend_id == friend.id).first()
        if existing_friendship and existing_friendship.is_active == True:
            return {'message': 'Friendship is already active.'}
        if existing_friendship and existing_friendship.is_active == False:
            update_friendship(existing_friendship.id)
            return {'message': 'Friendship has been reactivated.'}
        user_to_friend = Friendship(
            user_id=current_user.id,
            friend_id=friend.id
        )
        friend_to_user = Friendship(
            user_id=friend.id,
            friend_id=current_user.id
        )
        db.session.add_all([user_to_friend, friend_to_user])
        db.session.commit()
        return user_to_friend.to_dict(), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

def update_friendship(id):
    """
    Updates a friendship's active status
    """
    user_to_friend = Friendship.query.get(id)
    # checks if friendship exists
    if not user_to_friend:
        return {'errors': f"Friendship {id} does not exist."}, 400
    # checks if current user is a creator of the friendship
    if user_to_friend.user_id != current_user.id:
        return {'errors': f"User is not the creator of friendship {id}."}, 401
    friend_to_user = Friendship.query.filter(Friendship.user_id == user_to_friend.friend_id, Friendship.friend_id == user_to_friend.user_id).first()
    user_to_friend.is_active = not user_to_friend.is_active
    friend_to_user.is_active = not friend_to_user.is_active
    db.session.commit()
    return user_to_friend.to_dict()
```
